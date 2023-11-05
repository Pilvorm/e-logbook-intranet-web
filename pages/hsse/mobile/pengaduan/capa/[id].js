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
import { Button, FormGroup, Input, Label, Spinner } from "reactstrap";
import ModalAddPhoto from "components/Mobile_version/modal/ModalAddPhoto";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import ModalSearchTools from "components/Mobile_version/modal/ModalSearchTools";
import {
  getPengaduanById,
  submitPengaduan,
  submitPengaduanCAPA,
} from "redux/actions/pengaduan";
import { reauthenticate } from "redux/actions/auth";
import CustomCarousel from "components/Mobile_version/Carousel/CustomCarousel";
import CollapsibleDetailList from "components/CollaspeRowBatch";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import TableJenisLain from "components/Mobile_version/TableJenisLain";
import TablePengaduan from "components/Mobile_version/Pengaduan/TablePengaduan";
import TableCapaPengaduan from "components/Mobile_version/Pengaduan/TableCapaPengaduan";
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
      id: data?.id,
      nomorPengaduan: data?.nomorPengaduan || "",
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
      apar: data?.apar || {},
      detailJenis: data?.detailJenis || [],
      fotoPengaduans: data?.fotoPengaduans || [],
      capa: {
        tindakLanjut: "",
        keterangan: "",
      },
      capaDetails: data?.capaDetails || [],
    },
    validationSchema: yup.object().shape({
      nomorPeralatan: yup.string().required("Harus diisi"),
      fotoPengaduans: yup.array().min(1, "Harus diisi").required("Harus diisi"),
      keterangan: yup.string().required("Harus diisi"),
      capa: yup.object().shape({
        tindakLanjut: yup.string().required("Harus diisi"),
        keterangan: yup.string().required("Harus diisi"),
      }),
      capaDetails: yup.array().min(1, "Harus diisi"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setLoading(true);
      try {
        const newData = await Promise.all(
          values.capaDetails.map(async (file) => {
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
          ...data,
          ...values,
          capaDetails: newData,
        };

        console.log(newPengaduanData);

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
      submitPengaduanCAPA(compId, role, upn, name, email, newData)
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

  const alertNotification = () => {
    confirmAlertNotification(
      "Konfirmasi submit CAPA pengaduan",
      "Apakah anda yakin submit CAPA pengaduan?",
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
                          className={`${
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
                        {/* <Search
                          onClick={() => {
                            modalSearchHandler();
                          }}
                          size={15}
                        /> */}
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
              <TablePengaduan formik={formik} viewOnly={true} />
            </FormikProvider>
            <SelfCustomInput
              type="textarea"
              label={"Keterangan"}
              formik={formik}
              name={`keterangan`}
              disabled
            />

            <div className="mt-3">
              <strong style={{ color: "green" }}>CAPA</strong>
            </div>
            <FormGroup className="mx-0 px-0 col-12">
              <Label style={{ fontSize: "12px" }} className="font-weight-bold">
                {"Tindak Lanjut"}
              </Label>

              <div className="d-flex justify-content-between align-items-center pl-0">
                <Input
                  name={"capa.tindakLanjut"}
                  value={formik.values.capa.tindakLanjut}
                  invalid={
                    formik.touched &&
                    formik.touched.capa?.tindakLanjut &&
                    formik.errors.capa?.tindakLanjut
                  }
                  id="capa.tindakLanjut"
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched &&
              formik.touched.capa?.tindakLanjut &&
              formik.errors.capa?.tindakLanjut ? (
                <div className="text-danger" style={{ fontSize: "12px" }}>
                  {formik.errors.capa.tindakLanjut}
                </div>
              ) : null}
            </FormGroup>
            <FormikProvider value={formik}>
              <TableCapaPengaduan formik={formik} />
            </FormikProvider>
            <FormGroup className="mx-0 px-0 col-12">
              <Label style={{ fontSize: "12px" }} className="font-weight-bold">
                {"Keterangan"}
              </Label>

              <div className="d-flex justify-content-between align-items-center pl-0">
                <Input
                  type="textarea"
                  name={"capa.keterangan"}
                  value={formik.values.capa.keterangan}
                  invalid={
                    formik.touched &&
                    formik.touched.capa?.keterangan &&
                    formik.errors.capa?.keterangan
                  }
                  id="capa.keterangan"
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched &&
              formik.touched.capa?.keterangan &&
              formik.errors.capa?.keterangan ? (
                <div className="text-danger" style={{ fontSize: "12px" }}>
                  {formik.errors.capa.keterangan}
                </div>
              ) : null}
            </FormGroup>
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

    try {
      store.dispatch(reauthenticate(sessionData.user.token));

      const response = await store.dispatch(getPengaduanById(params.id));

      if (response.status >= 200 && response.status < 300) {
        return {
          props: {
            userRoles: sessionData,
            query: ctx.query,
            data: response.data,
            sessionData,
            token: sessionData.user.token,
          },
        };
      } else {
        return {
          props: {
            userRoles: sessionData,
            query: ctx.query,
            error: response.data,
          },
        };
      }
    } catch (e) {
      return {
        props: {
          userRoles: sessionData,
          query: ctx.query,
          error: "Error Occurred!",
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
