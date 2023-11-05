import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { wrapper } from "redux/store";
import chunk from "lodash/chunk";
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
import { SubmitData } from "redux/actions/inventory";
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
import AsyncSelect from "react-select/async";
import { saveNearmiss, submitNearmiss } from "redux/actions/nearmiss";
import { getAsyncOptionsUser } from "helpers/master/masterRole";
import { useCallback } from "react";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { ComboAlert } from "components/Alert";
import KaryawanData from "components/inspection/KaryawanData";
import NonKaryawanData from "components/inspection/NonKaryawanData";
import FileUploadModal from "components/online_form/nearmiss/FileUploadModal";

const AddNearmiss = (props) => {
  const { query, id, sessionData, token } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState("1");
  const [pageSize, setPageSize] = useState("1");
  const [searchQuery, setSearchQuery] = useState("1");
  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [buttonState, setButtonState] = useState("Save");
  const pageSizeOptions = [5, 10, 25, 50];
  const toggle = (key) => setActive(key);
  const handlePageSize = () => {};
  const handleSearchQuery = () => {};

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const [isActionBtnLoading, setIsActionBtnLoading] = useState(false);

  const loadOptionsUser = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsUser(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const [showModalBuktiKejadian, setShowModalBuktiKejadian] = useState(false);

  // Combo alert states
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const notificationHandler = (state) => {
    if (state == "Save") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin menyimpan data ini?`,
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
    }
  };

  const [visibleModalNonKaryawan, setVisibleModalNonKaryawan] = useState(false);
  const toggleModalNonKaryawan = () =>
    setVisibleModalNonKaryawan(!visibleModalNonKaryawan);

  const formik = useFormik({});
  console.log(sessionData.user);

  //transform

  const transformAndValidation = (values) => {
    const data = {
      createdByName: sessionData?.user.Name,
      creator: sessionData.user.UserPrincipalName || "System",
      nomorDokumen: "",
      companyCode: sessionData?.user.CompCode,
      site: sessionData?.user.CompName,
      companyName: sessionData?.user.CompName,
      EmailPelapor: sessionData?.user.Email,
      namaPelapor: sessionData?.user.Name || "System",
      NIKPelapor: sessionData?.user.NIK || "nik",
      status: "draft",
      upnPelapor: sessionData.user.UserPrincipalName,
      Departemen: sessionData?.user.DeptName,
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
      tindakanPerbaikan: [],
    };
    console.log(data, "dada");
    return data;
  };

  // Button Handler
  const onSaveHandler = async (data) => {
    console.log(data);

    const saveData = {
      ...data,
      status: "DRAFT",
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
      `Apakah Anda yakin ingin menyimpan data ini?`,
      () => {
        console.log(compId, upn, name, email);
        setIsActionBtnLoading(true);
        dispatch(saveNearmiss(compId, role, upn, name, email, saveData))
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
                  id: 0,
                  createdBy: "",
                  createdByName: "",
                  updatedBy: "",
                  updatedByName: "",
                  isDeleted: false,
                  site: sessionData?.user.CompName,
                  companyCode: "",
                  companyName: sessionData?.user.CompName,
                  namaPelapor: sessionData?.user.Name,
                  nik: sessionData?.user.NIK,
                  status: "",
                  upnPelapor: "",
                  Departemen: sessionData?.user.DeptName,
                  kategoriId: "",
                  kategori: "",
                  lokasiKejadian: "",
                  tanggalWaktuKejadian: "",
                  namaSaksi: "",
                  conditionRisk: "APD",
                  potensiBahaya: "",
                  investigasiNearmiss: "",
                  personilYangTerlibat: 0,
                  tanggalPengecekan: "",
                  creatorEmail: "",
                  creatorUpn: "",
                  creatorName: "",
                  superSuperiorName: "",
                  superSuperiorUPN: "",
                  superSuperiorEmail: "",
                  dataKaryawan: [],
                  dataNonKaryawan: [],
                  buktiKejadian: [],
                  tindakanPerbaikan: [],
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
                              id="submitBtn"
                              color="primary"
                              onClick={() => {
                                onSubmitHandler(transformAndValidation(values));
                              }}
                              disabled={formik.isSubmitting}
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
                              value={formik.values.nomorDokumen}
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
                              value={sessionData?.user.Name}
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
                                  value={sessionData?.user.CompName}
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
                              value={formik.values.nik}
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
                                isRequired
                                defaultOptions={kategoriNearmiss}
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
                              value={formik.values.dept}
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
                            value={formik.values.namaSaksi}
                            rows="3"
                            placeholder="Nama saksi"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          {/* TODO: integrasi field kondisi beresiko */}
                          <h6>Kondisi Beresiko</h6>
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
                            value={formik.values.potensiBahaya}
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
                            value={formik.values.investigasiNearmiss}
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
                                              <td>{file?.notes}</td>
                                              <td>{file?.fileName}</td>
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
                      <Row className="">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Tindakan Perbaikan</h5>
                            <FieldArray name="dataKaryawan">
                              {({ push, remove }) => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <Button.Ripple
                                      color="primary"
                                      id="buttonFilter"
                                      name="buttonFilter"
                                      className="btn-next mr-1"
                                    >
                                      <Plus size={18} />
                                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                                        Tindakan Perbaikan
                                      </span>
                                    </Button.Ripple>
                                  </div>
                                  <Table>
                                    <thead className="text-center">
                                      <tr>
                                        <th className="text-center">Action</th>
                                        <th className="text-center">No</th>
                                        <th className="text-center">
                                          Tindakan
                                        </th>
                                        <th className="text-center">Due</th>
                                        <th className="text-center">Date</th>
                                        <th className="text-center">
                                          PIC CAPA
                                        </th>
                                        <th className="text-center">Dept</th>
                                        <th className="text-center">
                                          Evidence
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center"></tbody>
                                  </Table>
                                </>
                              )}
                            </FieldArray>
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

AddNearmiss.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

const conditionRisk = [
  {
    id: "1",
    value: "APD ",
    label: "APD",
  },
  {
    id: "2",
    value: "Posisi & perbuatan seseorang",
    label: "Posisi & perbuatan seseorang",
  },
  { id: "3", value: "Lainnya", label: "Lainnya" },
  { id: "4", value: "Prosedur kerja", label: "Prosedur kerja" },
  { id: "5", value: "Kondisi alat kerja", label: "Kondisi alat kerja" },
  { id: "6", value: "Lingkungan", label: "Lingkungan" },
];

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

    //const dataSBU = await store.dispatch(getSbuAsyncSelect());
    const dataUser = await getAsyncOptionsUser("");

    // await store.dispatch(
    //   getAllInventoryByID(params.id, {
    //     "CSTM-COMPID": "01",
    //     "CSTM-NAME": "Mega",
    //     "CSTM-EMAIL": "teguh.valencia@kalbecorp.com",
    //     "CSTM-ROLE": "HSSE-INSP",
    //     "CSTM-UPN": "teguh.valencia@kalbe.co.id",
    //   })
    // );

    // console.log(dataDetailInventory);
    return {
      props: {
        token,
        //dataSBU,
        dataUser,
        query,
        sessionData,
      },
    };
  }
);

export default connect((state) => state)(AddNearmiss);
