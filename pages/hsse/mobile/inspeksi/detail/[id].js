import React, { useEffect, useState } from "react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { Carousel } from "react-responsive-carousel";
import HeaderHomeMobile from "components/Header-home-mobile/HeaderHomeMobile";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import CollapsibleDetailList from "components/CollaspeRowBatch";
import Webcam from "react-webcam";
import CameraComponent from "components/CameraComponent";
import CameraModal from "components/CameraModal";
import InspectionItem from "components/Mobile_version/inspection/ParameterInspection/InspectionItem";
import ParameterModal from "components/Mobile_version/inspection/Modal/AddModal";
import { wrapper } from "redux/store";
import { reauthenticate } from "redux/actions/auth";
import { getInspeksiId, submitInpeksi } from "redux/actions/inspeksi";
import { getSession } from "next-auth/react";
import ErrorPeriodeModal from "components/Mobile_version/inspection/Modal/ErrorPeriodeModal";
import {
  fetchImage,
  uploadMultipleFiles,
  uploadSingleFiles,
} from "helpers/shared";
import CustomInspeksiCarousel from "components/Mobile_version/Carousel/CustomInspeksiCarousel";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import ParameterContainer from "components/Mobile_version/inspection/ParameterInspection/ParameterContainer";
import * as yup from "yup";
import TableJenisLain from "components/Mobile_version/TableJenisLain";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import { useDispatch } from "react-redux";
import useMobileDetector from "components/useMobileDetector";

const seeMoreLinkStyle = {
  textDecoration: "underline",
  cursor: "pointer",
};

const DetailInspeksi = ({ data, error, token, sessionData }) => {
  
  const formik = useFormik({
    initialValues: {
      id: 0,
      nomorInspeksi: "",
      nomorPeralatan: data?.nomorPeralatan || "",
      jenisPeralatan: data?.jenisPeralatan || "",
      lokasi: data?.lokasi || "",
      area: data?.area || "",
      emailCreator: data?.creatorEmail || "",
      companyCode: data?.companyCode || "",
      companyName: data?.companyName || "",
      tglPengecekanTerakhir: "",
      tglPengecekanSelanjutnya: "",
      status: "",
      detailJenis: data?.inventoryDetailJenis || [],
      detailApar: data?.inventoryDetailApar || [],
      parameterInspeksi:
        data?.inventoryDetailParameter.map((param) => {
          return {
            namaParameter: param.nama || "",
            statusIsOk: true,
            catatan: param.keterangan || "",
            tindakLanjutCAPA: "",
            keteranganCAPA: "",
            lampiranParameterInspeksi: [],
            lampiranCAPAParameterInspeksi: [],
          };
        }) || [],
      attachments:
        data?.inventoryDetailGambar.map((file) => {
          return {
            idFile: file.fileId,
            namaFile: file.fileName,
            keterangan: file.nama,
          };
        }) || [],
    },
    validationSchema: yup.object().shape({
      parameterInspeksi: yup
        .array()
        .of(
          yup.object().shape({
            hsseOnlineInspeksiId: yup.string(),
            namaParameter: yup.string(),
            statusIsOk: yup.boolean(),
            catatan: yup.string().required("Harus diisi"),
            tindakLanjutCAPA: yup.string(),
            keteranganCAPA: yup.string(),
            lampiranParameterInspeksi: yup.array().min(1, "Harus diisi"),
            lampiranCAPAParameterInspeksi: yup.array(),
          })
        )
        .min(1, "Harus diisi")
        .required("Harus diisi"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const newData = await Promise.all(
          values.parameterInspeksi.map(async (param) => {
            const newLampiranParameterInspeksi = await Promise.all(
              param.lampiranParameterInspeksi.map(async (file) => {
                if (file.photo) {
                  const response = await hitAPIFile(file);

                  console.log(response, "HIT API RESPONSE");
                  return {
                    namaFile: response.data[0].fileName,
                    idFile: response.data[0].id,
                    keterangan: file.notes,
                    namaParameter: param.namaParameter,
                  };
                } else {
                  return file;
                }
              })
            );

            return {
              ...param,
              lampiranParameterInspeksi: newLampiranParameterInspeksi,
            };
          })
        );

        const newInspeksiData = {
          ...data,
          ...values,
          parameterInspeksi: newData,
        };

        SubmitHandler(newInspeksiData);
      } catch (e) {
        setLoading(false);
        console.log("Save ke local DB");
        console.error(e);
      }
    },
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const isMobileWidth = useMobileDetector();

  useEffect(() => {
    if (isMobileWidth) {
    } else {
      router.push("/home");
    }
  }, [isMobileWidth]);

  const [previewsHeader, setPreviewsHeader] = useState([]);

  const [labelSeeMore, setLabelSeeMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLabelSeeMore = () => {
    setLabelSeeMore((prevLabelSeeMore) => !prevLabelSeeMore);
  };

  const hitAPIFile = async (data) => {
    const { photo, notes } = data;

    const parts = photo.split(";base64,");
    const mimeType = parts[0].split(":")[1];
    const base64Data = parts[1];

    // Decode the base64 string to a binary buffer
    const binaryString = window.atob(base64Data);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const imageBlob = new Blob([byteArray], { type: mimeType });

    const fileName = `image ${Date.now().toString()} .jpg`; // Provide your desired file name
    const file = new File([imageBlob], fileName, { type: mimeType });

    const formData = new FormData();
    formData.append("image web", file);

    console.log(formData);

    const response = await uploadMultipleFiles(formData, "inspeksi");

    return response;
  };

  const SubmitHandler = async (newData) => {
    let role = "";
    const compId = sessionData?.user?.CompCode;
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
      console.log(role, "ROLE");
    } catch (e) {
      console.error(e);
      role = "";
    }

    const hitSubmit = dispatch(
      submitInpeksi(compId, role, upn, name, email, newData)
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

  const alertNotification = () => {
    confirmAlertNotification(
      "Konfirmasi submit inspeksi",
      "Apakah anda yakin submit inspeksi?",
      () => {
        formik.submitForm();
      },
      () => {}
    );
  };

  return (
    <div>
      {error ? (
        <ErrorPeriodeModal text={error} />
      ) : (
        <div className="">
          <HeaderHomeMobile title="INSPEKSI" onBack={() => router.back()} />
          <div className="w-100 d-flex justify-content-center align-items-center flex-column text-center align-middle mt-2">
            <div className="w-75">
              <CustomInspeksiCarousel dataImage={formik.values.attachments} />
            </div>
            <div className="mt-2 w-100">
              <CollapsibleDetailList
                data={[
                  {
                    title: "Nomor Inspeksi",
                    value: formik.values.nomorInspeksi,
                  },
                  {
                    title: "Nomor Peralatan",
                    value: formik.values.nomorPeralatan,
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
                        value: formik.values.detailApar[0].media,
                      },
                      {
                        title: "Merk",
                        value: formik.values.detailApar[0].merk,
                      },
                      {
                        title: "Kapasitas",
                        value: formik.values.detailApar[0].kapasitas,
                      },
                      {
                        title: "Berat",
                        value: formik.values.detailApar[0].berat,
                      },
                      {
                        title: "Tanggal Ed Tabung",
                        value: formik.values.detailApar[0].tanggalEdTabung,
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
            <ParameterContainer formik={formik} />
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
        </div>
      )}
    </div>
  );
};

DetailInspeksi.getLayout = function getLayout(page) {
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

      const response = await store.dispatch(
        getInspeksiId(params.id, {
          "CSTM-COMPID": sessionData.user.CompCode,
          "CSTM-NAME": sessionData.user.Name,
          "CSTM-EMAIL": sessionData.user.Email,
          "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0] || "",
          "CSTM-UPN": sessionData.user.UserPrincipalName,
        })
      );
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
  }
);

export default DetailInspeksi;
