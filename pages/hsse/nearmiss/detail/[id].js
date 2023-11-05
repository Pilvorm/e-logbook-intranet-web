import React, { useState, useReducer } from "react";
import { ExportIndicator, ListHeader, Pagination } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import AsyncSelect from "react-select/async";
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
  Card,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  Check,
  Search,
  Save,
  Play,
  Plus,
  Eye,
  Download,
  Trash,
  Edit,
  XSquare,
  ArrowLeft,
  ExternalLink,
  Calendar,
  MoreVertical,
} from "react-feather";
import FormikInput from "components/CustomInputs/CustomInput";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import { useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import {
  approvalLog,
  getAllNearmissById,
  submitNearmiss,
  updateNearmiss,
} from "redux/actions/nearmiss";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import { FieldArray, Formik, FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import { saveNearmiss } from "redux/actions/nearmiss";
import { getAsyncOptionsUser } from "helpers/master/masterRole";
import { useCallback } from "react";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { ComboAlert } from "components/Alert";
import KaryawanData from "components/inspection/KaryawanData";
import NonKaryawanData from "components/inspection/NonKaryawanData";
import FileUploadModal from "components/online_form/nearmiss/FileUploadModal";
import AddNewNearmiss from "components/inspection/AddNewNearmiss";
import { EditData } from "redux/actions/nearmiss";
import { useEffect } from "react";
import PICModal from "components/p3k/PICModal";
import TindakanPerbaikan from "components/inspection/Modal/TindakanPerbaikan";

const kategoriNearmiss = [
  {
    id: "1",
    name: "Nearmiss / Hampir mengalami celaka",
    value: "Nearmiss / Hampir mengalami celaka",
    label: "Nearmiss / Hampir mengalami celaka",
  },
  {
    id: "2",
    name: "Unsafe action / Perilaku tidak aman",
    value: "Unsafe action / Perilaku tidak aman",
    label: "Unsafe action / Perilaku tidak aman",
  },
  {
    id: "3",
    name: "Unsafe condition / Kondisi tidak aman",
    value: "Unsafe condition / Kondisi tidak aman",
    label: "Unsafe condition / Kondisi tidak aman",
  },
];

const DetailNearmiss = (props) => {
  const { data: session, status } = useSession();
  const { data, dataSBU, dataUser, token, sessionData, dataId, dataApproval } =
    props;

  const [pageNumber, setPageNumber] = useState("1");
  const [pageSize, setPageSize] = useState("1");
  const [searchQuery, setSearchQuery] = useState("1");
  const [active, setActive] = useState("1");
  const [lainnya, setLainnya] = useState("");
  const [values, setValues] = useState(null);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const pageSizeOptions = [5, 10, 25, 50];
  const [normalInjury] = useState([]);
  const [heavyInjury] = useState([]);
  const toggle = (key) => setActive(key);
  const handlePageSize = () => {};
  const handleSearchQuery = () => {};
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  // Combo alert states
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  //action button loading
  const [isActionBtnLoading, setIsActionBtnLoading] = useState(false);

  //modal bukti kejadian + karyawan
  const [showModalBuktiKejadian, setShowModalBuktiKejadian] = useState(false);
  const [visibleModalNonKaryawan, setVisibleModalNonKaryawan] = useState(false);
  const toggleModalNonKaryawan = () =>
    setVisibleModalNonKaryawan(!visibleModalNonKaryawan);
  console.log(data.emailPelapor, "ini data asli");

  //transform
  const transformAndValidation = (values) => {
    console.log(sessionData);
    const data = {
      ...props.data,
      // createdBy: data?.createdBy,
      // createdByName: data?.createdByName,
      updatedBy: sessionData?.user.Name,
      updatedByName: sessionData?.user.Name,
      updatedDate: new Date(),
      emailPelapor: values.emailPelapor,
      site: values.site,
      companyName: values.companyName,
      status: "draft",
      Kategori: values.kategori,
      lokasiKejadian: values.lokasiKejadian,
      tanggalWaktuKejadian: values.tanggalWaktuKejadian,
      namaSaksi: values.namaSaksi,
      PerilakuKondisiBerisiko: values.conditionRisk,
      potensiBahaya: values.potensiBahaya,
      investigasiNearmiss: values.investigasiNearmiss,
      personilYangTerlibat: 0,
      creatorEmail: sessionData?.user.Email,
      creatorUpn: sessionData?.user.UserPrincipalName,
      creatorName: sessionData?.user.Name,
      dataKorbanKaryawan: values.dataKaryawan,
      dataKorbanNonKaryawan: values.dataNonKaryawan,
      buktiKejadian: values.buktiKejadian,
      tindakanPerbaikan: values.tindakanPerbaikan,
    };
    console.log(data, data.emailPelapor, "dada");
    return data;
  };

  // Button Handler
  const onSaveHandler = async (data) => {
    console.log(data, "data onsavehandler");
    return;
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
    confirmAlertNotification(
      "Confirmation",
      `Apakah Anda yakin ingin menyimpan data ini?`,
      () => {
        setIsActionBtnLoading(true);
        dispatch(updateNearmiss(props.dataId, data))
          .then((res) => {
            successAlertNotificationWithFunction(
              "Sukses",
              "Data berhasil disimpan",
              () => {
                router.reload();
              }
            );
          })
          .catch((res) => {
            console.error(res, "error onSaveHandler");
            let errorMessages = [];
            if (res.status === 401) {
              return errorAlertNotification("Error", res.response.data.message);
            }

            if (res.response.status === 409) {
              return errorAlertNotification(
                "Error Duplicate",
                "Duplicate Data"
              );
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
          })
          .finally(() => {
            setIsActionBtnLoading(false);
          });
      },
      () => {}
    );
  };

  //submit handler
  const onSubmitHandler = async (data) => {
    const submitData = {
      ...data,
      status: "string",
    };

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

    confirmAlertNotification(
      "Confirmation",
      `Apakah Anda yakin ingin submit data ini?`,
      () => {
        setIsActionBtnLoading(true);
        dispatch(submitNearmiss(compId, role, upn, name, email, submitData))
          .then((res) => {
            successAlertNotificationWithFunction(
              "Sukses",
              "Data berhasil disubmit",
              () => {
                router.push(`/hsse/nearmiss`);
              }
            );
          })
          .catch((res) => {
            console.error(res, "error onSubmitHandler");
            let errorMessages = [];
            if (res.response.status === 401) {
              return errorAlertNotification("Error", res.response.data.message);
            }

            if (res.response.status === 409) {
              return errorAlertNotification(
                "Error Duplicate",
                "Duplicate Data"
              );
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
                    : "Data gagal disubmit. Silahkan dicoba beberapa saat lagi",
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
          })
          .finally(() => {
            setIsActionBtnLoading(false);
          });
      },
      () => {}
    );
  };

  // approval-related reconfirmation
  const notificationHandler = (state) => {
    if (state == "Revise") {
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
  return (
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan Nearmiss"
        breadCrumbActive="Detail"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Add Form</h2>
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

      <Card>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <Formik
                enableReinitialize
                initialValues={{
                  createdBy: data?.createdBy,
                  createdByName: data?.createdByName,
                  updatedBy: "",
                  updatedByName: "",
                  isDeleted: false,
                  site: data?.site,
                  companyCode: data?.companyCode,
                  companyName: data?.site,
                  namaPelapor: data?.namaPelapor,
                  emailPelapor: data?.emailPelapor,
                  nik: data?.nikPelapor,
                  status: data?.status,
                  upnPelapor: data?.upnPelapor,
                  Departemen: data?.departemen,
                  kategori: data?.kategori,
                  lokasiKejadian: data?.lokasiKejadian,
                  tanggalWaktuKejadian: data?.tanggalWaktuKejadian,
                  namaSaksi: data?.namaSaksi,
                  conditionRisk: data?.perilakuKondisiBerisiko,
                  potensiBahaya: data?.potensiBahaya,
                  investigasiNearmiss: data?.investigasiNearmiss,
                  personilYangTerlibat: 0,
                  tanggalPengecekan: "",
                  dataKaryawan: data?.dataKorbanKaryawan ?? [],
                  dataNonKaryawan: data?.dataKorbanNonKaryawan ?? [],
                  buktiKejadian: data?.buktiKejadian ?? [],
                  tindakanPerbaikan: data?.tindakanPerbaikan ?? [],
                }}
                // validationSchema={validationSchema}
              >
                {(formik) => (
                  <>
                    {/* ACTIONS */}
                    <div className="d-flex justify-content-between align-items-center w-100 flex-wrap">
                      <div
                        className="d-flex flex-wrap"
                        style={{
                          gap: 20,
                          width: "70%",
                          paddingTop: "1rem",
                          paddingLeft: "2rem",
                        }}
                      >
                        <Button.Ripple
                          outline
                          type="submit"
                          color="danger"
                          className="btn-next"
                          onClick={() => router.back()}
                        >
                          <ArrowLeft size={18} />
                          <span className="ml-50 align-middle d-sm-inline-block d-none">
                            Back
                          </span>
                        </Button.Ripple>

                        {!isActionBtnLoading ? (
                          <>
                            <Button.Ripple
                              id="saveBtn"
                              color="primary"
                              onClick={() => {
                                onSaveHandler(
                                  transformAndValidation(formik.values)
                                );
                              }}
                            >
                              <Save size={18} />
                              <span className="align-middle ml-1 d-sm-inline-block d-none">
                                Save
                              </span>
                            </Button.Ripple>

                            <Button.Ripple
                              id="saveBtn"
                              color="primary"
                              onClick={() => {
                                onSubmitHandler(
                                  transformAndValidation(formik.values)
                                );
                              }}
                            >
                              {formik.isSubmitting ? (
                                <>
                                  <Spinner size="sm" color="white" />
                                  <span className="ml-50">Submitting...</span>
                                </>
                              ) : (
                                <div
                                  className="d-flex"
                                  style={{ alignItems: "center" }}
                                >
                                  <Save size={18} />
                                  <div className="ml-1">Submit</div>
                                </div>
                              )}
                            </Button.Ripple>
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
                      </div>

                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "rgba(255, 184, 76, 0.12)",
                          color: "#FFB84C",
                          height: 40,
                          borderRadius: 10,
                          minWidth: 140,
                          marginTop: "1rem",
                          marginRight: "2rem",
                          fontSize: "1rem",
                          fontWeight: 500,
                        }}
                      >
                        Draft
                      </div>
                    </div>

                    <Container className="mt-2">
                      <Row>
                        <Col md="6">
                          <FormGroup className="custom-input-select" md="6">
                            <Label className="form-label">Nomor Dokumen</Label>
                            <Input
                              type="text"
                              placeholder="Nomor Peralatan"
                              name="nomorDokumen"
                              value={data?.nomorDokumen}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <FormGroup className="custom-input-select" md="6">
                            <Label className="form-label">Nama Pelapor</Label>
                            <Input
                              type="text"
                              placeholder="Nama Pelapor"
                              name="namaPelapor"
                              value={data?.namaPelapor}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col style={{ zIndex: 22 }} sm="6">
                          <div style={{ zIndex: 222 }}>
                            <FormGroup className="custom-input-select" md="6">
                              <Label className="form-label">Company</Label>
                              <div style={{ zIndex: 222 }}>
                                <Input
                                  id="companyName"
                                  name="companyName"
                                  classNamePrefix="select"
                                  cacheOptions
                                  value={data?.site}
                                  disabled
                                  // loadOptions={loadOptionsSBU}
                                  // onChange={(e) => {
                                  //   setFieldValue("companyCode", e.idmCompCode);
                                  // }}
                                />
                              </div>
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm="6">
                          <FormGroup className="custom-input-select" md="6">
                            <Label className="form-label">NIK</Label>
                            <Input
                              type="text"
                              placeholder="NIK"
                              name="nik"
                              value={data?.nikPelapor}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ zIndex: 22 }} sm="6">
                          <div style={{ zIndex: 222 }}>
                            <FormGroup className="" md="6">
                              <Label>Kategori</Label>
                              <AsyncSelect
                                type="text"
                                label="kategori"
                                name="kategori"
                                placeholder=""
                                defaultOptions={kategoriNearmiss}
                                value={[
                                  {
                                    value: formik.values.kategori,
                                    label: formik.values.kategori,
                                  },
                                ]}
                                isRequired
                                onChange={(e) => {
                                  formik.setFieldValue("kategori", e.value);
                                  // console.log(values.kategori,"dada");
                                }}
                              />
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm="6">
                          <FormGroup className="custom-input-select" md="6">
                            <Label className="form-label">Departemen</Label>
                            <Input
                              type="text"
                              placeholder="Departemen"
                              name="dept"
                              value={data?.departemen}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="mt-5">
                        <h6>Personil yang terlibat kejadian</h6>
                      </div>

                      {/*===== DATA KORBAN KARYAWAN =====*/}
                      <KaryawanData formik={formik} />

                      {/*===== DATA KORBAN NON-KARYAWAN =====*/}
                      <NonKaryawanData formik={formik} />

                      {/*===== BAGIAN TUBUH YANG TERLUKA =====*/}
                      <Row className="mt-2">
                        <Col sm="6">
                          <FormikInput
                            label="Lokasi Kejadian"
                            style={{ minHeight: 100 }}
                            type="textarea"
                            name="lokasiKejadian"
                            id="lokasiKejadian"
                            value={formik.values.lokasiKejadian}
                            rows="3"
                            placeholder="Lokasi kejadian"
                          />
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikDatePicker
                              label="Tanggal Kejadian"
                              name="tanggalWaktuKejadian"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="">
                        <Col sm="12">
                          <FormikInput
                            label="Nama saksi"
                            style={{ minHeight: 100 }}
                            type="textarea"
                            name="namaSaksi"
                            id="namaSaksi"
                            //value={data?.namaSaksi}
                            rows="3"
                            placeholder="Nama saksi"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          {/* TODO: integrasi field kondisi beresiko */}
                          <FormikInput
                            type="textarea"
                            label="Kondisi Beresiko"
                            name="perilakuKondisiBeresiko"
                            placeholder="belum final apakah pakai radio/checkbox"
                            customInlineStyle={{
                              resize: "none",
                              height: "114px",
                            }}
                            isRequired
                            //value={data?.perilakuKondisiBerisiko}
                          />
                          {/* <FieldArray name="conditionRisk">
                            {(helpers) => (
                              <>
                                {chunk(conditionRisk, 11).map(
                                  (list, outerIndex) => (
                                    <Col key={outerIndex} className="p-0">
                                      {list.map((item, innerIndex) => (
                                        <FormGroup key={innerIndex}>
                                          <CustomInput
                                            type="checkbox"
                                            id={`condition-risk-${outerIndex}-${innerIndex}`}
                                            label={item.value}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                helpers.push(item);
                                                console.log(item)
                                              } else {
                                                helpers.remove(
                                                  console.log(item,"coba uncheck"),
                                                  formik.values.conditionRisk.findIndex(
                                                    (i) => i.id == item.id
                                                  ),
                                                  console.log(item, "setelahuncheck")
                                                );
                                              }
                                            }}
                                            checked={formik.values.conditionRisk.some(
                                              (i) => i.id == item.id
                                            )}
                                            inline
                                          />
                                        </FormGroup>
                                      ))}
                                    </Col>
                                  )
                                )}
                              </>
                            )}
                          </FieldArray> */}
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm="12">
                          <FormikInput
                            label="Potensi Bahaya - Deskripsi Insiden "
                            type="textarea"
                            name="potensiBahaya"
                            placeholder="Potensi Bahaya"
                            customInlineStyle={{
                              resize: "none",
                              height: "90px",
                            }}
                            value={data?.potensiBahaya}
                            isRequired
                          />
                        </Col>
                      </Row>
                      <Row className="">
                        <Col sm="12">
                          <FormikInput
                            label="Investigasi Nearmiss"
                            style={{ minHeight: 100 }}
                            type="textarea"
                            name="investigasiNearmiss"
                            id="investigasiNearmiss"
                            value={data?.investigasiNearmiss}
                            rows="3"
                            placeholder="Investigasi Nearmiss"
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <FormGroup tag={Col} md="6"></FormGroup>
                        </Col>
                      </Row>

                      <Row></Row>

                      {/*===== LAMPIRAN =====*/}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Bukti Kejadian</h5>
                            <FieldArray name="buktiKejadian">
                              {({ push, remove }) => {
                                return (
                                  <>
                                    <div className="d-flex align-items-center">
                                      <Button.Ripple
                                        color="primary"
                                        id="buttonFilter"
                                        name="buttonFilter"
                                        className="btn-next mr-1"
                                        onClick={() =>
                                          setShowModalBuktiKejadian(true)
                                        }
                                      >
                                        <Plus size={18} />
                                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                                          Bukti Kejadian
                                        </span>
                                      </Button.Ripple>
                                    </div>

                                    <Table
                                      responsive
                                      className="border"
                                      style={{}}
                                    >
                                      <thead className="text-center">
                                        <tr>
                                          <th className="text-center">
                                            Action
                                          </th>
                                          <th className="text-center">No</th>
                                          <th className="text-center">
                                            Keterangan
                                          </th>
                                          <th className="text-center">
                                            Nama File
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-center">
                                        {formik.values.buktiKejadian.map(
                                          (file, index) => (
                                            <tr key={index}>
                                              <td>
                                                <UncontrolledDropdown>
                                                  <DropdownToggle
                                                    className="icon-btn hide-arrow"
                                                    id="optionsSelect"
                                                    color="transparent"
                                                    size="sm"
                                                    caret
                                                  >
                                                    <MoreVertical size={15} />
                                                  </DropdownToggle>
                                                  <DropdownMenu>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Download
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        Download
                                                      </span>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Eye
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        View
                                                      </span>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                      className="w-100"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                      id="deleteBtn"
                                                    >
                                                      <Trash
                                                        className="mr-50"
                                                        size={15}
                                                      />
                                                      <span className="align-middle">
                                                        Delete
                                                      </span>
                                                    </DropdownItem>
                                                  </DropdownMenu>
                                                </UncontrolledDropdown>
                                              </td>
                                              <td>{index + 1}</td>
                                              <td>{file?.keterangan}</td>
                                              <td>{file?.namaFile}</td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </Table>

                                    <FileUploadModal
                                      show={showModalBuktiKejadian}
                                      onHide={() =>
                                        setShowModalBuktiKejadian(false)
                                      }
                                      onFileUpload={(
                                        idFile,
                                        notes,
                                        fileName
                                      ) => {
                                        push({
                                          fileId: idFile,
                                          keterangan: notes,
                                          namaFile: fileName,
                                        });
                                        setShowModalBuktiKejadian(false);
                                      }}
                                    />
                                  </>
                                );
                              }}
                            </FieldArray>
                          </div>
                        </Col>

                        <Table
                          responsive
                          bordered
                          className="border mt-2"
                        ></Table>
                      </Row>

                      {/*===== CORRECTIVE ACTION =====*/}

                      <Row>
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Tindakan Perbaikan</h5>
                            <TindakanPerbaikan formik={formik} />
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </>
                )}
              </Formik>
              <ComboAlert
                routerPath="/master/user"
                {...{
                  isAlertModal,
                  setIsAlertModal,
                  alertStatus,
                  alertMessage,
                }}
              />
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </div>
  );
};

DetailNearmiss.getLayout = function getLayout(page) {
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
      getAllNearmissById(params.id, {
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
      })
    );

    const data = store.getState().masterNearmissReducers;
    console.log(data.id, "hello");
    //const approvalLog = await store.dispatch(Appro)

    const dataApproval = await store
      .dispatch(approvalLog(data.nomorDokumen))
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
        token: sessionData.user.token,
        dataId: params.id,
        data,
        sessionData,
        dataApproval,
      },
    };
  }
);

export default DetailNearmiss;
