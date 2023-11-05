import React, { useEffect, useState } from "react";
import { ListHeader } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { wrapper } from "redux/store";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Spinner,
  Table,
  Row,
  Col,
} from "reactstrap";
import {
  Check,
  Save,
  Play,
  Edit,
  XSquare,
  ArrowLeft,
  Printer,
  Eye,
  Download,
  ExternalLink,
} from "react-feather";
import { Paper } from "@mui/material";
import ModalFilter from "components/inspection/ModalFilter";
import DetaiDataInventory from "components/inspection/DetailDataInventory";
import { useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import {
  EditData,
  getAllInventoryByID,
  SubmitData,
  ReviseData,
  RejectData,
  ApproveData,
  ApprovalLog,
  GenerateQR,
} from "redux/actions/inventory";
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import AddNewInventory from "components/inspection/AddNewInventory";
import moment from "moment";
import { display } from "@mui/system";
import {
  getPermissionComponent,
  getPermissionComponentByRoles,
} from "helpers/getPermission";
import axios from "axios";
import {
  confirmAlertNotification,
  errorAlertNotification,
  reviseAlertNotification,
  reviseWithValidation,
  successAlertNotificationWithFunction,
} from "components/notification";
import { fetchImage, uploadMultipleFiles } from "helpers/shared";
import QrModal from "components/inspection/Modal/QrModal";
import FileSaver from "file-saver";
import StatusModal from "components/inspection/Modal/StatusModal";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
const DetailInventory = (props) => {
  const { dataDetailInventory, query, id, token, sessionData, approvalLog } =
    props;
  console.log(approvalLog, "APPROVAL LOG");

  const router = useRouter();
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState("1");
  const [pageSize, setPageSize] = useState("1");
  const [searchQuery, setSearchQuery] = useState("1");
  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const pageSizeOptions = [5, 10, 25, 50];
  const [buttonState, setButtonState] = useState("Save");

  const [openStatusModal, setOpenStatusModal] = useState(false);

  const openStatusModalHandler = () => {
    setOpenStatusModal((state) => !state);
  };

  const [qrImage, setQrImage] = useState(null);
  const [openQrModal, setOpenQrModal] = useState(false);

  const openQrModalHandler = () => {
    setOpenQrModal((state) => !state);
  };

  const downloadQr = () => {
    FileSaver.saveAs(qrImage, "QRCode");
  };

  const printQr = () => {
    var win = window.open("");
    win.document.write(
      '<img src="' + qrImage + '" onload="window.print();window.close()" />'
    );
    win.focus();
  };

  const toggle = (key) => setActive(key);

  const handlePageSize = () => {};
  const handleSearchQuery = () => {};

  // const dummyData = {
  //   nomorPeralatan: "0001/APR/DF",
  //   site: "PT Dankos Farma",
  //   type: "APAR",
  //   periodCheck: 12,
  // };

  useEffect(async () => {
    dispatch(reauthenticate(token));
    dispatch(GenerateQR(dataDetailInventory.nomorPeralatan)).then((res) => {
      setQrImage(res);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      id: dataDetailInventory.id,
      createdBy: dataDetailInventory.createdBy,
      createdByName: dataDetailInventory.createdByName,
      createdDate: dataDetailInventory.createdDate,
      updatedBy: dataDetailInventory.updatedBy,
      updatedByName: dataDetailInventory.updatedByName,
      isDeleted: dataDetailInventory.isDeleted,
      nomorPeralatan: dataDetailInventory.nomorPeralatan,
      companyCode: dataDetailInventory.companyCode,
      companyName: dataDetailInventory.companyName,
      kodeJenisPeralatan: dataDetailInventory.kodeJenisPeralatan,
      jenisPeralatan: dataDetailInventory.jenisPeralatan,
      lokasi: dataDetailInventory.lokasi,
      area: dataDetailInventory.area,
      periodePengecekan: dataDetailInventory.periodePengecekan,
      tanggalPengecekan: moment(dataDetailInventory.tanggalPengecekan).format(
        "D MMM yyyy"
      ),
      status: dataDetailInventory.status,
      creatorEmail: dataDetailInventory.creatorEmail,
      creatorUpn: dataDetailInventory.creatorUpn,
      creatorName: dataDetailInventory.creatorName,
      superSuperiorName: dataDetailInventory.superSuperiorName,
      superSuperiorUPN: dataDetailInventory.superSuperiorUPN,
      superSuperiorEmail: dataDetailInventory.superSuperiorEmail,
      inventoryDetailParameter: dataDetailInventory.inventoryDetailParameter,
      inventoryDetailGambar: dataDetailInventory.inventoryDetailGambar,
      inventoryDetailApar: dataDetailInventory.inventoryDetailApar,
      inventoryDetailJenis: dataDetailInventory.inventoryDetailJenis,
    },
    validationSchema: yup.object().shape({
      jenisPeralatan: yup.string().required("Harus diisi"),
      lokasi: yup.string().required("Harus diisi"),
      area: yup.string().required("Harus diisi"),
      area: yup.string().required("Harus diisi"),
      periodePengecekan: yup.number().required("Harus diisi"),
      tanggalPengecekan: yup.date().required("Harus diisi"),
      inventoryDetailParameter: yup
        .array()
        .of(
          yup.object().shape({
            nama: yup.string().required("Harus diisi"),
            keterangan: yup.string().required("Harus diisi"),
            // Rest of your amenities object properties
          })
        ),
      inventoryDetailApar: yup.array().when("jenisPeralatan", {
        is: "APAR",
        then: yup
          .array()
          .of(
            yup.object().shape({
              media: yup.string().required("Harus diisi"),
              merk: yup.string().required("Harus diisi"),
              kapasitas: yup.string().required("Harus diisi"),
              berat: yup.string().required("Harus diisi"),
              tanggalEdTabung: yup.date().required("Harus diisi"),
            })
          )
          .required("Harus diisi"),
        otherwise: yup.array(),
      }),
      inventoryDetailJenis: yup.array().when("jenisPeralatan", {
        is: (jenisPeralatan) => {
          return jenisPeralatan == "APD" || jenisPeralatan == "Spill Kit";
        },
        then: yup
          .array()
          .of(
            yup.object().shape({
              jenis: yup.string().required("Harus diisi"),
              jumlah: yup.string().required("Harus diisi"),
            })
          )
          .min(1)
          .required("Harus diisi"),
        otherwise: yup.array(),
      }),
    }),
    onSubmit: async (values) => {
      if (!imageError) {
        setSubmitLoading(true);
        try {
          const formData = new FormData();

          imageList.forEach((fileData, index) => {
            formData.append(`file${index + 1}`, fileData.file);
          });

          const response = await uploadMultipleFiles(formData, "Inventory");

          const dataFileTemp = response.data.map((fileData, index) => ({
            no: index + 1,
            nama: imageList[index].nama,
            fileId: fileData.id,
            fileName: fileData.fileName,
          }));

          const newData = {
            ...values,
            inventoryDetailGambar: [
              ...values.inventoryDetailGambar,
              ...dataFileTemp,
            ],
            tanggalPengecekan: moment(values.tanggalPengecekan).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            companyCode: sessionData?.user?.CompCode,
            companyName: sessionData?.user?.CompName,
            creatorEmail: sessionData?.user?.Email,
            creatorUpn: sessionData?.user?.UserPrincipalName,
            creatorName: sessionData?.user?.Name,
          };

          console.log(newData);

          if (buttonState === "Save") {
            await SaveHandler(newData);
          } else if (buttonState === "Submit") {
            await SubmitHandler(newData);
          }

          // Handle the newData or any further logic here

          setSubmitLoading(false);
        } catch (error) {
          // Handle any errors that occur during the file upload or other operations
          console.error("Error:", error);
          setSubmitLoading(false);
        }
      } else {
        setImageError(true);
      }
    },
  });

  const notificationHandler = (state) => {
    if (state == "Save") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin perbaharui data ini?`,
        () => {
          formik.submitForm();
        },
        () => {}
      );
    } else if (state == "Submit") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin submit data ini?`,
        () => {
          formik.submitForm();
        },
        () => {}
      );
    } else if (state == "Revise") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin untuk revise data ini?`,
        () => {
          reviseWithValidation(state, "test", ReviseHandler);
        },
        () => {}
      );
    } else if (state == "Reject") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin untuk reject data ini?`,
        () => {
          reviseWithValidation(state, "test", RejectHandler);
        },
        () => {}
      );
    } else if (state == "Approve") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin untuk approve data ini?`,
        () => {
          ApproveHandler();
        },
        () => {}
      );
    }
  };

  const SaveHandler = async (newData) => {
    setSubmitLoading(true);
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
      EditData(compId, role, upn, name, email, newData)
    )
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil disimpan",
            () => {
              router.reload();
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
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
        setSubmitLoading(false);
        return res;
      })
      .catch((error) => {
        setSubmitLoading(false);
        console.error(error);
      });
  };

  const SubmitHandler = async (newData) => {
    setSubmitLoading(true);
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
      SubmitData(compId, role, upn, name, email, newData)
    )
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil disubmit",
            () => {
              router.push(`/hsse/inventory`);
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
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
        setSubmitLoading(false);
        return res;
      })
      .catch((error) => {
        setSubmitLoading(false);
        console.error(error);
      });
  };

  const ReviseHandler = async (note) => {
    setSubmitLoading(true);
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

    const id = formik.values.id;
    console.log(id);

    const hitSubmit = await dispatch(
      ReviseData(compId, role, upn, name, email, id, note)
    )
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil direvise",
            () => {
              router.push(`/hsse/inventory`);
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
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
        setSubmitLoading(false);
        return res;
      })
      .catch((error) => {
        setSubmitLoading(false);
        console.error(error);
      });
  };

  const RejectHandler = async (note) => {
    setSubmitLoading(true);
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

    const id = formik.values.id;

    const hitSubmit = dispatch(
      RejectData(compId, role, upn, name, email, id, note)
    )
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil direject",
            () => {
              router.push(`/hsse/inventory`);
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
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
        setSubmitLoading(false);
        return res;
      })
      .catch((error) => {
        setSubmitLoading(false);
        console.error(error);
      });
  };

  const ApproveHandler = async () => {
    setSubmitLoading(true);
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

    const id = formik.values.id;

    const hitSubmit = dispatch(ApproveData(compId, role, upn, name, email, id))
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil diapprove",
            () => {
              router.push(`/hsse/inventory`);
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
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
                  : "Something went wrong, Please try again later.",
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
        setSubmitLoading(false);
        return res;
      })
      .catch((error) => {
        setSubmitLoading(false);
        console.error(error);
      });
  };

  const [imageList, setImageList] = useState([]);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (
      formik.touched.inventoryDetailGambar &&
      imageList.length == 0 &&
      formik.values.inventoryDetailGambar.length == 0
    ) {
      setImageError(true);
    } else {
      setImageError(false);
    }
  }, [
    imageList,
    formik.values.inventoryDetailGambar,
    formik.touched.inventoryDetailGambar,
  ]);
  return (
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Inspection"
        breadCrumbParent2="Inventory"
        breadCrumbActive="Add New"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Detail Inventory</h2>
      </div>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
            className={`${active === "1" ? "text-dark" : "text-muted"}`}
          >
            Data
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
            className={`${active === "2" ? "text-dark" : "text-muted"}`}
          >
            Approval Log
          </NavLink>
        </NavItem>
      </Nav>
      <Paper elevation={6}>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <div>
                <Row className="d-flex justify-content-between w-100 flex-wrap">
                  <Col md="10" sm="8">
                    {!submitLoading ? (
                      <>
                        <Button
                          color="danger"
                          outline
                          onClick={(e) => {
                            e.preventDefault();
                            router.back();
                          }}
                          className="mr-1 mb-1"
                        >
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <ArrowLeft size={15} color="red" />
                            <span className="ml-1">Back</span>
                          </div>
                        </Button>
                        {getPermissionComponentByRoles([
                          "HSSE-INSP",
                          "HSSE-SYSADMIN",
                        ]) &&
                          (formik.values.status.includes("DRAFT") ||
                            formik.values.status.includes(
                              "Waiting for revision"
                            )) && (
                            <>
                              <Button.Ripple
                                color="info"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setButtonState("Save");
                                  notificationHandler("Save");
                                }}
                                className="mr-1 mb-1"
                              >
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <Save size={15} />
                                  <span className="ml-1">Save</span>
                                </div>
                              </Button.Ripple>
                              <Button.Ripple
                                color="success"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setButtonState("Submit");
                                  notificationHandler("Submit");
                                }}
                                className="mr-1 mb-1"
                              >
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <Play size={15} />
                                  <div className="ml-1" id="confirmSubmit">Submit</div>
                                </div>
                              </Button.Ripple>
                            </>
                          )}
                        {getPermissionComponentByRoles([
                          "HSSE-INSP-SUP",
                          "HSSE-SYSADMIN",
                        ]) &&
                          formik.values.status.includes("approval") && (
                            <>
                              <Button.Ripple
                                color="success"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setButtonState("Approve");
                                  notificationHandler("Approve");
                                }}
                                className="mr-1 mb-1"
                              >
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <Check size={15} />
                                  <div className="ml-1">Approve</div>
                                </div>
                              </Button.Ripple>
                              <Button.Ripple
                                color="warning"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setButtonState("Revise");
                                  notificationHandler("Revise");
                                }}
                                className="mr-1 mb-1"
                              >
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <Edit size={15} />
                                  <div className="ml-1">Revise</div>
                                </div>
                              </Button.Ripple>
                              <Button.Ripple
                                color="danger"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setButtonState("Reject");
                                  notificationHandler("Reject");
                                }}
                                className="mr-1 mb-1"
                              >
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <XSquare size={15} />
                                  <div className="ml-1">Reject</div>
                                </div>
                              </Button.Ripple>
                            </>
                          )}

                        {formik.values.status.includes("Approved") && (
                          <>
                            <Button.Ripple
                              color="info"
                              onClick={() => {
                                printQr();
                              }}
                              className="mr-1 mb-1"
                            >
                              <div
                                className="d-flex"
                                style={{ alignItems: "center" }}
                              >
                                <Printer size={15} />
                                <div className="ml-1">Cetak QR</div>
                              </div>
                            </Button.Ripple>
                            <Button.Ripple
                              color="secondary"
                              onClick={() => {
                                openQrModalHandler();
                              }}
                              className="mr-1 mb-1"
                            >
                              <div
                                className="d-flex"
                                style={{ alignItems: "center" }}
                              >
                                <Eye size={15} />
                                <div className="ml-1">Show QR</div>
                              </div>
                            </Button.Ripple>
                            <Button.Ripple
                              color="primary"
                              onClick={() => {
                                downloadQr();
                              }}
                              className="mr-1 mb-1"
                            >
                              <div
                                className="d-flex"
                                style={{ alignItems: "center" }}
                              >
                                <Download size={15} />
                                <div className="ml-1">Download QR</div>
                              </div>
                            </Button.Ripple>
                          </>
                        )}
                      </>
                    ) : (
                      <Button.Ripple
                        color="primary"
                        disabled={true}
                        onClick={() => {}}
                      >
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Submitting...</span>
                        </>
                      </Button.Ripple>
                    )}
                  </Col>

                  <Col md="2" sm="" className="text-right">
                    <Button.Ripple
                      color="warning"
                      onClick={openStatusModalHandler}
                    >
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Eye size={15} />
                        <div className="ml-1">Status</div>
                      </div>
                    </Button.Ripple>
                  </Col>
                </Row>
                <AddNewInventory
                  formik={formik}
                  token={token}
                  imageList={imageList}
                  setImageList={setImageList}
                  sessionData={sessionData}
                  imageError={imageError}
                  approvalLog={approvalLog}
                />
              </div>
            </TabPane>
            <TabPane tabId="2">
              <Row className="d-flex justify-content-between w-100 flex-wrap">
                <Col md="10" sm="8"></Col>

                <Col md="2" sm="" className="text-right">
                  <Button.Ripple
                    color="warning"
                    onClick={openStatusModalHandler}
                  >
                    <div className="d-flex" style={{ alignItems: "center" }}>
                      <Eye size={15} />
                      <div className="ml-1">Status</div>
                    </div>
                  </Button.Ripple>
                </Col>
              </Row>
              <div className="mt-4">
                <Table responsive className="border">
                  <thead>
                    <tr>
                      <th className="w-5 text-left">No</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">User</th>
                      <th className="text-left">Message</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalLog.map((data, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{data.status}</td>
                          <td>{data.approverFromName}</td>
                          <td>{data.notes}</td>
                          <td>{data.createdDate}</td>
                          <td>{data.duration}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Paper>
      <QrModal
        openModal={openQrModal}
        openModalHandler={openQrModalHandler}
        preview={qrImage}
        nomorPeralatan={formik.values.nomorPeralatan}
      />
      <StatusModal
        openModal={openStatusModal}
        openModalHandler={openStatusModalHandler}
        status={formik.values.status}
      />
    </div>
  );
};

DetailInventory.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
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

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    await store.dispatch(
      getAllInventoryByID(params.id, {
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
      })
    );

    const dataDetailInventory = store.getState().masterInventoryReducers;

    const approvalLog = await store
      .dispatch(ApprovalLog(dataDetailInventory.nomorPeralatan))
      .then((res) => {
        console.log(res);
        return res.data.data;
      })
      .catch((e) => {
        console.log(e, "ERROR APPROVAL LOG");
        return [];
      });

    return {
      props: {
        token,
        dataDetailInventory,
        query,
        sessionData,
        approvalLog,
      },
    };
  }
);

export default connect((state) => state)(DetailInventory);
