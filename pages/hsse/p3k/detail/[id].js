import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useState } from "react";
import { ExportIndicator, ListHeader, Pagination } from "components/shared";
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
  Card,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import {
  Check,
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

import FormikSelectInput from "components/CustomInputs/CustomSelect";
import FormikAsyncSelect from "components/CustomInputs/CustomAsyncSelect2";
import FormikInput from "components/CustomInputs/CustomInput";
import FormikRadioInput from "components/CustomInputs/CustomRadio";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import FormikHourPicker from "components/CustomInputs/CustomHourPicker";
import CustomCheckbox from "components/CustomInputs/CustomCheckbox";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";

import { Paper } from "@mui/material";
import ModalFilter from "components/inspection/ModalFilter";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Textarea from "src/views/forms/form-elements/textarea";
import TextareaDefault from "src/views/forms/form-elements/textarea/TextareaDefault";
import RadioBasic from "src/views/forms/form-elements/radio/RadioBasic";

const DetailAccidentReport = ({}) => {
  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState("1");
  const [pageNumber, setPageNumber] = useState("1");

  const [searchQuery, setSearchQuery] = useState("1");
  const [visibleFilter, setVisibleFilter] = useState(false);

  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const toggle = (key) => setActive(key);

  const [penyebabLain, setPenyebabLain] = useState(false);

  const jobStatusOptions = [
    { value: "PT Dankos Farma", label: "PT Dankos Farma" },
    { value: "PT Kalbe Farma", label: "PT Kalbe Farma" },
  ];

  const dummyData = [
    {
      no: "0001/LKK/DF/XI/22",
    },
  ];

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: value,
        pageNumber: 1,
        search: searchQuery,
      },
    });
  };

  const handlePagination = (page) => {
    setPageNumber(page.selected + 1);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: page.selected + 1,
        search: searchQuery,
      },
    });
  };

  const handleSearchQuery = () => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: pageNumber,
        search: searchQuery,
      },
    });
  };

  const router = useRouter();

  return (
    <div className="min-vh-100">
      {/* <ModalFilter
        isOpen={visibleFilter}
        toggle={(bool) => setVisibleFilter(bool)}
      /> */}
      <BreadCrumbs
        breadCrumbParent="Online Form"
        breadCrumbParent2="Laporan Penggunaan P3k"
        breadCrumbActive="Detail"
      />
      <div className="my-2">
        <h2 className="m-0">Laporan Penggunaan P3K</h2>
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
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Save size={18} />
                        <div className="ml-1">Save</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Play size={18} />
                        <div className="ml-1">Submit</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Check size={18} />
                        <div className="ml-1">Approve</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Edit size={18} />
                        <div className="ml-1">Revise</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <XSquare size={18} />
                        <div className="ml-1">Reject</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ArrowLeft size={18} />
                        <div className="ml-1">Back</div>
                      </div>
                    )}
                  </Button.Ripple>
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
              <Formik
                initialValues={{
                  dokumen: "",
                  pelapor: "",
                  site: "",
                  nik: "",
                  supervisor: "",
                  departemen: "",
                }}
                validationSchema={() =>
                  yup.lazy((values) => {
                    return yup.object({
                      dokumen: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("Dokumen harus diisi"),
                      pelapor: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("Pelapor harus diisi"),
                      site: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("Site harus diisi"),
                      nik: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("NIK harus diisi"),
                      supervisor: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("Supervisor harus diisi"),
                      departemen: yup
                        .string()
                        .min(1)
                        .max(200)
                        .required("Departemen harus diisi"),
                    });
                  })
                }
                onSubmit={(values) => {
                  dispatch().then((res) => {
                    // updateFdd({
                    //   participantOrganization: {
                    //     activity: values.activity,
                    //     newsPaperName: values.newsPaperName,
                    //     topicRead: values.topicRead,
                    //     skill: values.skill,
                    //     ...(values.isOrganization === "Yes" && {
                    //       name: values.name,
                    //       cityName: values.cityName,
                    //       cityId: values.cityId,
                    //       jabatan: values.jabatan,
                    //       yearStart: values.yearStart,
                    //       yearEnd: values.yearEnd,
                    //     }),
                    //   },
                    // })
                    if (res.status === HTTP_CODE.OK) {
                      stepper.next();
                    } else {
                      errorAlertNotification("Error", "Failed to save data.");
                    }
                  });
                }}
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit}>
                    <Container>
                      {/* INFO KEJADIAN */}
                      <Row className="mt-3">
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="text"
                              label="Nomor Dokumen"
                              name="nomorDokumen"
                              placeholder=""
                              value={dummyData.nomorDokumen}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="text"
                              label="Nama Pelapor"
                              name="namaPelapor"
                              placeholder=""
                              value={dummyData.namaPelapor}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikSelectInput
                              label="Site"
                              name="site"
                              options={jobStatusOptions}
                              placeholder="Pilih Site"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="text"
                              label="NIK"
                              name="nik"
                              placeholder=""
                              value={dummyData.nik}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikAsyncSelect
                              name="supervisor"
                              label="Supervisor / Penanggung jawab kegiatan korban"
                              value={{
                                label: formik.values.cityName,
                                value: formik.values.cityId,
                              }}
                              onChange={(option) => {
                                formik.setFieldValue(
                                  "cityName",
                                  option?.label || ""
                                );
                                formik.setFieldValue(
                                  "cityId",
                                  option?.value || -1
                                );
                              }}
                              // loadOptions={loadOptionsCity}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="text"
                              label="Departemen"
                              name="Departemen"
                              placeholder=""
                              value={dummyData.departemen}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* DETAIL KEJADIAN */}
                      <Row className="mt-3">
                        <Col md="12">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Lokasi Kejadian"
                              name="lokasiKejadian"
                              placeholder=""
                              height="100px"
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <Row>
                            <Col md="6">
                              <FormGroup tag={Col} md="12">
                                <FormikDatePicker
                                  label="Tanggal Kejadian"
                                  name="tanggalKejadian"
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup tag={Col} md="12">
                                <FormikHourPicker
                                  label="Waktu Kejadian"
                                  name="waktuLejadian"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Nama Saksi"
                              name="namaSaksi"
                              placeholder=""
                              height="100px"
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* P3K YANG DIGUNAKAN */}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>P3K yang Digunakan</h5>
                            <FieldArray name="itemp3k">
                              {({ push, remove }) => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <Button.Ripple
                                      color="primary"
                                      id="buttonFilter"
                                      name="buttonFilter"
                                      className="btn-next mr-1"
                                      onClick={() => {
                                        push({
                                          item: "",
                                          amount: 0,
                                        });
                                      }}
                                    >
                                      <Plus size={18} />
                                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                                        Item P3K
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
                                        <th>Action</th>
                                        <th>No</th>
                                        <th>Item</th>
                                        <th>Jumlah</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {dummyData.map((_, index) => (
                                        <tr key={index}>
                                          <td>
                                            <Button
                                              color="danger"
                                              type="button"
                                              onClick={() => remove(index)}
                                            >
                                              <Trash size={15} />
                                            </Button>
                                          </td>
                                          <td>{index + 1}</td>
                                          <td className="w-25">
                                            <FormGroup md="6">
                                              <FormikAsyncSelect
                                                name="item"
                                                value={{
                                                  label: formik.values.cityName,
                                                  value: formik.values.cityId,
                                                }}
                                                onChange={(option) => {
                                                  formik.setFieldValue(
                                                    "cityName",
                                                    option?.label || ""
                                                  );
                                                  formik.setFieldValue(
                                                    "cityId",
                                                    option?.value || -1
                                                  );
                                                }}
                                                // loadOptions={loadOptionsCity}
                                              />
                                            </FormGroup>
                                          </td>
                                          <td>x</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                  {/* {typeof formik.errors.participantContacts ===
                                    "string" && (
                                    <div className="text-danger">
                                      {formik.errors.participantContacts}
                                    </div>
                                  )} */}
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </Col>
                      </Row>

                      {/* PENYEBAB INSIDEN */}
                      <Row className="mt-3">
                        <Col md="12">
                          <div className="mx-1">
                            <h5>Penyebab Insiden</h5>
                            <FormGroup>
                              {/* <Label for="exampleCheckbox">Checkboxes</Label> */}
                              <div className="d-flex" style={{ gap: "64px" }}>
                                <div
                                  className="d-flex flex-column"
                                  style={{ gap: "8px" }}
                                >
                                  <CustomInput
                                    type="checkbox"
                                    id="apd"
                                    label="APD"
                                  />
                                  <CustomInput
                                    type="checkbox"
                                    id="kondisi"
                                    label="Kondisi alat kerja"
                                  />
                                  <CustomInput
                                    type="checkbox"
                                    id="lingkungan"
                                    label="Lingkungan"
                                  />
                                </div>
                                <div
                                  className="d-flex flex-column"
                                  style={{ gap: "8px" }}
                                >
                                  <CustomInput
                                    type="checkbox"
                                    id="posisi"
                                    label="Posisi & perbuatan seseorang"
                                  />
                                  <CustomInput
                                    type="checkbox"
                                    id="prosedur"
                                    label="Prosedur kerja"
                                  />
                                </div>
                                <div
                                  className="d-flex flex-column w-50"
                                  style={{ gap: "8px" }}
                                >
                                  <CustomInput
                                    type="checkbox"
                                    id="lainnya"
                                    label="Lainnya"
                                    onClick={() =>
                                      setPenyebabLain(!penyebabLain)
                                    }
                                  />
                                  {penyebabLain && (
                                    <FormGroup className>
                                      <FormikInput
                                        type="text"
                                        name="penyebabLain"
                                        placeholder=""
                                        height="42px"
                                      />
                                    </FormGroup>
                                  )}
                                </div>
                              </div>
                            </FormGroup>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col md="12">
                          <FormGroup tag={Col} md="12">
                            <FormikInput
                              type="textarea"
                              label="Deskripsi Aktivitas"
                              name="deksripsiAktivitas"
                              placeholder=""
                              height="100px"
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* BUKTI KEJADIAN */}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Bukti Kejadian</h5>
                            <FieldArray name="recommendedAction">
                              {({ push, remove }) => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <Button.Ripple
                                      color="primary"
                                      id="buttonFilter"
                                      name="buttonFilter"
                                      className="btn-next mr-1"
                                      onClick={() => {
                                        push({
                                          item: "",
                                          amount: 0,
                                        });
                                      }}
                                    >
                                      <Plus size={18} />
                                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                                        Bukti
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
                                        <th>Action</th>
                                        <th>No</th>
                                        <th>Keterangan</th>
                                        <th>Nama File</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {dummyData.map((_, index) => (
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
                                                  onClick={() => remove(index)}
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
                                                  onClick={() => remove(index)}
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
                                                  onClick={() => remove(index)}
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
                                          <td>x</td>
                                          <td>x</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                  {/* {typeof formik.errors.participantContacts ===
                                    "string" && (
                                    <div className="text-danger">
                                      {formik.errors.participantContacts}
                                    </div>
                                  )} */}
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikAsyncSelect
                              name="tempatKejadian"
                              label="Tempat Kejadian"
                              value={{
                                label: formik.values.cityName,
                                value: formik.values.cityId,
                              }}
                              onChange={(option) => {
                                formik.setFieldValue(
                                  "cityName",
                                  option?.label || ""
                                );
                                formik.setFieldValue(
                                  "cityId",
                                  option?.value || -1
                                );
                              }}
                              // loadOptions={loadOptionsCity}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* RECOMMENDED ACTION */}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Recommended Action</h5>
                            <FieldArray name="recommendedAction">
                              {({ push, remove }) => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <Button.Ripple
                                      color="primary"
                                      id="buttonFilter"
                                      name="buttonFilter"
                                      className="btn-next mr-1"
                                      onClick={() => {
                                        push({
                                          item: "",
                                          amount: 0,
                                        });
                                      }}
                                    >
                                      <Plus size={18} />
                                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                                        Recommended Action
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
                                        <th>Action</th>
                                        <th>No</th>
                                        <th>Recommendation</th>
                                        <th>Due Date</th>
                                        <th>PIC CAPA</th>
                                        <th>Dept</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-center">
                                      {dummyData.map((_, index) => (
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
                                                  onClick={() => remove(index)}
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
                                                  onClick={() => remove(index)}
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
                                                  onClick={() => remove(index)}
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
                                          <td>x</td>
                                          <td>x</td>
                                          <td>x</td>
                                          <td>x</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                  {/* {typeof formik.errors.participantContacts ===
                                    "string" && (
                                    <div className="text-danger">
                                      {formik.errors.participantContacts}
                                    </div>
                                  )} */}
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </Form>
                )}
              </Formik>
            </TabPane>
            <TabPane tabId="2">
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
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Save size={18} />
                        <div className="ml-1">Save</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Play size={18} />
                        <div className="ml-1">Submit</div>
                      </div>
                    )}
                  </Button.Ripple>

                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ArrowLeft size={18} />
                        <div className="ml-1">Back</div>
                      </div>
                    )}
                  </Button.Ripple>
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
              <div className="mt-4" style={{ margin: "1rem" }}>
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
                    {/* {[{}].map((data) => (
                      <CreateTableRow
                        key={data?.id}
                        {...{ data, router, token: "a" }}
                      />
                    ))} */}
                  </tbody>
                </Table>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </div>
  );
};

DetailAccidentReport.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
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
        // closeProjectData,
        userRoles: sessionData,
      },
    };
  }
);

export default DetailAccidentReport;
