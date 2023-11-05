import React, { useEffect, useState, useReducer } from "react";
import { getSession } from "next-auth/react";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { useRouter } from "next/router";
import useMobileDetector from "components/useMobileDetector";
import dynamic from "next/dynamic";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import Carousel from "components/Carousel";
import Image from "next/image";
import { Trash, Search } from "react-feather";
import { Button, Input, Spinner } from "reactstrap";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import { getPengaduanById, submitPengaduan } from "redux/actions/pengaduan";
import { reauthenticate } from "redux/actions/auth";
import CustomCarousel from "components/Mobile_version/Carousel/CustomCarousel";
import CollapsibleDetailList from "components/CollaspeRowBatch";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import TableJenisLain from "components/Mobile_version/TableJenisLain";
import TablePengaduan from "components/Mobile_version/Pengaduan/TablePengaduan";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import SearchModal from "components/Mobile_version/Pengaduan/Modal/SearchModal";
import { useDispatch } from "react-redux";
import { getAllInventoryByID } from "redux/actions/inventory";
import { hitAPIFile } from "helpers/uploadCamFiles";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

const seeMoreLinkStyle = {
  textDecoration: "underline",
  cursor: "pointer",
};

const Pengaduan = ({ userRoles, query, data, sessionData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const style4 = {
    borderRadius: 10,
    backgroundColor: "#46a583",
    height: 48,
    width: "90%",
    margin: "auto",
    marginTop: 20,
    textAlign: "center",
    color: "white",
    placeItems: "center",
    fontSize: 14,
    fontWeight: 600,
  };

  const isMobileWidth = useMobileDetector();
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [modalSearch, setModalSearch] = useState(false);
  const modalSearchHandler = () => {
    setModalSearch((state) => !state);
  };
  const [labelSeeMore, setLabelSeeMore] = useState(false);
  const toggleLabelSeeMore = () => {
    setLabelSeeMore((prevLabelSeeMore) => !prevLabelSeeMore);
  };

  const formik = useFormik({
    initialValues: {
      id: 0,
      nomorPengaduan: "",
      nomorPeralatan: data?.nomorPeralatan || "",
      companyCode: data?.companyCode || "",
      companyName: data?.companyName || "",
      jenisPeralatan: data?.jenisPeralatan || "",
      lokasi: data?.lokasi || "",
      area: data?.area || "",
      periodePengecekan: data?.periodePengecekan || "",
      tglPengecekan: data?.tglPengecekan || "",
      status: data?.status || "DRAFT",
      keterangan: data?.keterangan || "",
      creatorEmail: data?.creatorEmail || "",
      creatorUpn: data?.creatorUpn || "",
      creatorName: data?.creatorName || "",
      gambarInventory: data?.gambarInventory || [],
      parameters: data?.parameters || [],
      apar: data?.apar || [],
      detailJenis: data?.detailJenis || [],
      fotoPengaduans: data?.fotoPengaduans || [],
    },
    validationSchema: yup.object().shape({
      nomorPeralatan: yup.string().required("Harus diisi"),
      fotoPengaduans: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      keterangan: yup.string().required("Harus diisi"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const newData = await Promise.all(
          values.fotoPengaduans.map(async (file) => {
            if (file.photo) {
              const response = await hitAPIFile(file, "pengaduan");

              console.log(response, "HIT API RESPONSE");
              return {
                fileName: response.data[0].fileName,
                fileId: response.data[0].id,
                keterangan: file.notes,
              };
            } else {
              return file;
            }
          })
        );

        const newPengaduanData = {
          ...values,
          fotoPengaduans: newData,
        };

        SubmitHandler(newPengaduanData);
      } catch (e) {
        setLoading(false);
        console.log("Save ke local DB");
        console.error(e);
      }
    },
  });

  const SubmitHandler = async (newData) => {
    let role = "";
    const compId = sessionData?.user?.CompCode;
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
    } catch (e) {
      console.error(e);
      role = "";
    }

    const hitSubmit = dispatch(
      submitPengaduan(compId, role, upn, name, email, newData)
    )
      .then((res) => {
        setLoading(false);
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil disubmit",
            () => {
              router.back();
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.status === 401) {
            return errorAlertNotification("Error", res.data.message);
          }

          if (res.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.data.errors).flatMap(
              ([field, messages]) => {
                return messages.map((message) => ({ field, message }));
              }
            );
          } catch (error) {
            // Handle the error appropriately
            console.log(error);
            errorMessages = [
              {
                field: "Error",
                message: res.data
                  ? res.data
                  : "Data gagal disimpan. Silahkan dicoba beberapa saat lagi",
              },
            ];
          }

          const title = "Error";
          const message =
            errorMessages.length > 0
              ? errorMessages
                  .map(({ field, message }) => `${field}: ${message}`)
                  .join("\n")
              : "";

          errorAlertNotification(title, message);
        }

        setLoading(false);
        return res;
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  useEffect(() => {
    if (isMobileWidth) {
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  useEffect(() => {
    dispatch(reauthenticate(sessionData.user.token));
  }, []);

  const getInventoryById = (id) => {
    dispatch(
      getAllInventoryByID(id, {
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0].RoleCode,
        "CSTM-UPN": sessionData.user.UserPrincipalName,
      })
    ).then((res) => {
      setLoadingPhoto(true);
      setLabelSeeMore(false);
      const newData = res.data;

      if (newData.jenisPeralatan == "APAR") {
        const newApar = {
          media: newData.inventoryDetailApar[0].media,
          merk: newData.inventoryDetailApar[0].merk,
          berat: newData.inventoryDetailApar[0].berat,
          kapasitas: newData.inventoryDetailApar[0].kapasitas,
          tglEDTabung: newData.inventoryDetailApar[0].tglEDTabung,
        };
        formik.setFieldValue("apar", newApar);
      } else {
        const newApar = {
          media: "media",
          merk: "merk",
          berat: "berat",
          kapasitas: "kapasitas",
          tglEDTabung: new Date(),
        };

        formik.setFieldValue("apar", newApar);
      }

      formik.setFieldValue("detailJenis", newData.inventoryDetailJenis);
      formik.setFieldValue("nomorPeralatan", newData.nomorPeralatan);
      formik.setFieldValue("jenisPeralatan", newData.jenisPeralatan);
      formik.setFieldValue("companyCode", newData.companyCode);
      formik.setFieldValue("companyName", newData.companyName);
      formik.setFieldValue("area", newData.area);
      formik.setFieldValue("lokasi", newData.lokasi);
      formik.setFieldValue("periodePengecekan", newData.periodePengecekan);
      formik.setFieldValue("tglPengecekan", newData.tanggalPengecekan);
      formik.setFieldValue("creatorEmail", newData.creatorEmail);
      formik.setFieldValue("creatorName", newData.creatorName);
      formik.setFieldValue("creatorUpn", newData.creatorUpn);
      formik.setFieldValue(
        "gambarInventory",
        newData.inventoryDetailGambar.map((gambar) => {
          return {
            fileId: gambar.fileId,
            fileName: gambar.fileName,
            keterangan: gambar.nama,
          };
        })
      );

      const newParam = newData.inventoryDetailParameter.map((param) => {
        return {
          keterangan: param.keterangan,
          nama: param.nama,
        };
      });
      
      formik.setFieldValue("parameters", newParam);
      setLoadingPhoto(false);
    });

    modalSearchHandler();
  };

  const alertNotification = () => {
    confirmAlertNotification(
      "Konfirmasi submit pengaduan",
      "Apakah anda yakin submit pengaduan?",
      () => {
        formik.submitForm();
      },
      () => {}
    );
  };

  return (
    <>
      {isMobileWidth ? (
        <div>
          <HeaderHomeMobile title="PENGADUAN" onBack={() => router.back()} />
          <div className="w-100 d-flex justify-content-center align-items-center flex-column text-center align-middle mt-2">
            <div className="w-75">
              {!loadingPhoto && (
                <CustomCarousel dataImage={formik.values.gambarInventory} />
              )}
            </div>
            <div className="mt-2 w-100">
              <CollapsibleDetailList
                data={[
                  {
                    title: "Nomor Pengaduan",
                    value: formik.values.nomorPengaduan,
                  },
                  {
                    title: "Nomor Peralatan",
                    value: (
                      <>
                        <span
                          className={`mr-1 ${
                            formik.touched.nomorPeralatan &&
                            formik.errors.nomorPeralatan
                              ? "text-danger"
                              : ""
                          }`}
                        >
                          {formik.touched.nomorPeralatan &&
                          formik.errors.nomorPeralatan
                            ? formik.errors.nomorPeralatan
                            : formik.values.nomorPeralatan}
                        </span>
                        <Search
                          onClick={() => {
                            modalSearchHandler();
                          }}
                          size={15}
                        />
                      </>
                    ),
                  },
                  {
                    title: "Jenis Peralatan",
                    value: formik.values.jenisPeralatan,
                  },
                  {
                    title: "Lokasi",
                    value: formik.values.lokasi,
                  },
                ]}
              />
            </div>
            {labelSeeMore ? (
              <div className="mt-2 w-100">
                <CollapsibleDetailList
                  data={[
                    {
                      title: "Area",
                      value: formik.values.area,
                    },
                  ]}
                />
                {formik.values.jenisPeralatan == "APAR" && (
                  <CollapsibleDetailList
                    data={[
                      {
                        title: "Media",
                        value: formik.values.apar?.media || "",
                      },
                      {
                        title: "Merk",
                        value: formik.values.apar?.merk || "",
                      },
                      {
                        title: "Kapasitas",
                        value: formik.values.apar?.kapasitas || "",
                      },
                      {
                        title: "Berat",
                        value: formik.values.apar?.berat || "",
                      },
                      {
                        title: "Tanggal Ed Tabung",
                        value: formik.values.apar?.tanggalEdTabung || "",
                      },
                    ]}
                  />
                )}
                {(formik.values.jenisPeralatan == "Spill Kit" ||
                  formik.values.jenisPeralatan == "APD") && (
                  <TableJenisLain data={formik.values.detailJenis} />
                )}
              </div>
            ) : (
              ""
            )}
            <a
              className="mt-2 text-success"
              onClick={toggleLabelSeeMore}
              style={seeMoreLinkStyle}
            >
              {labelSeeMore ? "See Less" : "See More"}
            </a>
          </div>
          <div className="mt-1 mx-2">
            <FormikProvider value={formik}>
              <TablePengaduan formik={formik} />
            </FormikProvider>
            <SelfCustomInput
              type="textarea"
              label={"Keterangan"}
              formik={formik}
              name={`keterangan`}
            />
          </div>

          <div className="m-2">
            <Button
              color="primary mb-2"
              className="w-100"
              onClick={() => alertNotification()}
            >
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </div>
          <div style={{ height: 20 }} />
          <SearchModal
            openModal={modalSearch}
            openModalHandler={modalSearchHandler}
            sessionData={sessionData}
            submitHandler={getInventoryById}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

Pengaduan.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query, params } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        sessionData,
        userRoles: sessionData,
        query: ctx.query,
      },
    };
  }
);

export default Pengaduan;
