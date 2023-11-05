import React, { useEffect, useReducer, useState } from "react";
import { Button, Row, Col, FormGroup, Label, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import { Calendar, Plus, Table } from "react-feather";
import axios from "axios";
import KaryawanData from "./KaryawanData";
import NonKaryawanData from "./NonKaryawanData";
import { Checkbox, Paper } from "@mui/material";
import debounce from "lodash/debounce";
import AsyncSelect from "react-select/async";
import { useCallback } from "react";
import { getAsyncOptionsUser } from "helpers/master/masterRole";
import { getAsyncOptionsSBU } from "helpers/sbu";
import { FieldArray } from "formik";
import FileUploadModal from "components/online_form/nearmiss/FileUploadModal";

const AddNewNearmiss = (props) => {
  const {
    dataDetailNearmiss,
    dataSBU,
    formik,
    token,
    imageList,
    setImageList,
    sessionData,
  } = props;

  console.log(sessionData);
  const conditionRisk = [
    {
      name: "APD ",
      isChecked: false,
    },
    {
      name: "Posisi & perbuatan seseorang",
      isChecked: false,
    },
    {
      name: "Lainnya",
      isChecked: false,
    },
    {
      name: "Prosedur kerja",
      isChecked: false,
    },
    {
      name: "Kondisi alat kerja",
      isChecked: false,
    },
    {
      name: "",
    },
    {
      name: "Lingkungan ",
      isChecked: false,
    },
  ];

  const kategoriNearmiss = [
    {
      id: "1",
      name: "Nearmiss / hampir mengalami celaka",
    },
    {
      id: "2",
      name: "Unsafe action / perilaku tidak aman",
    },
    {
      id: "3",
      name: "Unsafe condition / kondisi tidak aman",
    },
  ];
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [showModalBuktiKejadian, setShowModalBuktiKejadian] = useState(false);

  const loadOptionsUser = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsUser(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const loadOptionsSBU = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsSBU(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [selectedLokasi, setSelectedLokasi] = useState(null);
  //Function untuk get Lov Lokasi dari master Lokasi
  const hitGetLovLokasi = async () => {
    await axios({
      url: "/api/Lov/lokasi",
      method: "GET",
      headers: {
        AppAuthorization: token,
        "X-COMPCODE": sessionData.user.CompCode,
      },
    })
      .then((res) => {
        const data = res.data.data.data;
        const newData = data.map((x) => {
          return {
            value: x.lokasi,
            label: x.lokasi,
          };
        });

        setLokasiOptions(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Function untuk Change Handler Combobox area
  const lokasiChangeHandler = (data) => {
    console.log(data);
    formik.setFieldValue("lokasi", data);
  };

  //AREA UTILS SECTION
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  //Function untuk get Lov Area dari master Area. Belum ambil per site;
  const hitGetLovArea = async () => {
    await axios({
      url: "/api/Lov/area",
      method: "GET",
      headers: {
        AppAuthorization: token,
        "X-COMPCODE": sessionData.user.CompCode,
      },
    })
      .then((res) => {
        const data = res.data.data.data;
        const newData = data
          .filter((x) => {
            return x.status == "Active";
          })
          .map((x) => {
            return {
              value: x.area,
              label: x.area,
            };
          });

        setAreaOptions(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Function untuk Change Handler Combobox area
  const areaChangeHandler = (data) => {
    console.log(data);
    formik.setFieldValue("area", data);
  };

  useEffect(async () => {
    await hitGetLovArea();
    await hitGetLovLokasi();

    setSelectedLokasi({
      value: formik.values.lokasi,
      label: formik.values.lokasi,
    });
    setSelectedArea({
      value: formik.values.area,
      label: formik.values.area,
    });
  }, []);
  return (
    <>
      <div className="mt-5">
        <Row>
          <Col sm="6">
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

        <KaryawanData formik={formik} />
        <NonKaryawanData formik={formik} />

        <div className="mt-2">
          <h6>
            Lokasi Kejadian <span style={{ color: "red" }}>*</span>
          </h6>
          <Input
            style={{ minHeight: 100 }}
            type="textarea"
            name="text"
            id="exampleText"
            rows="3"
            placeholder="Lokasi kejadian"
            value={formik.values.lokasiKejadian}
          />
        </div>
        <div className="mt-2" style={{ width: "40%" }}>
          <FormGroup className="custom-input-select" md="6">
            <h6 className="form-label text-bold">
              Tanggal dan Waktu Kejadian <span style={{ color: "red" }}>*</span>
            </h6>
            <div
              className="d-flex justify-content-between align-items-center pl-0"
              style={{ gap: 30 }}
            >
              <div className="form-control d-flex justify-content-between align-items-center pl-0">
                <DatePicker
                  id="tanggalWaktuKejadian"
                  placeholderText="Placeholder"
                  dateFormat="dd MMM yyyy"
                  showMonthDropdown
                  showYearDropdown
                  selected={new Date()}
                  dropdownMode="select"
                  className="form-control w-100 border-left-0 border-right-0"
                />
                <div className="mx-50"></div>
                <Calendar size={18} />
              </div>
              <div className="d-flex justify-content-between align-items-center pl-0">
                <Input
                  style={{ maxWidth: "85%", textAlign: "center" }}
                  type="text"
                  placeholder="Periode Pengecekan"
                  name="potensi_bahaya"
                  value={"12:50"}
                />
              </div>
            </div>
          </FormGroup>
        </div>
        <div className="mt-2">
          <h6>
            Nama Saksi <span style={{ color: "red" }}>*</span>
          </h6>
          <Input
            style={{ minHeight: 100 }}
            type="textarea"
            name="namaSaksi"
            id="namaSaksi"
            value={formik.values.namaSaksi}
            rows="3"
            placeholder="Nama saksi"
          />
        </div>
        <div className="mt-2">
          <h6>
            Perilaku / Kondisi berisiko <span style={{ color: "red" }}>*</span>
          </h6>
          <div className="d-flex w-100" style={{ gap: 20 }}>
            <div>
              <div>
                {conditionRisk.map((item, index) => (
                  <div key={index}>
                    {index % 2 === 0 && index !== 2 && (
                      <div className="d-flex">
                        <Checkbox
                          {...label}
                          onChange={(e) => {
                            console.log(e.target);
                           
                          }}
                          color="success"
                        />
                        <p style={{ paddingTop: 12 }}>{item.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div>
                {conditionRisk.map((item, index) => (
                  <div key={index}>
                    {index % 2 !== 0 && item.name !== "" && (
                      <div className="d-flex">
                        <Checkbox
                          {...label}
                          onChange={(e) => {
                            console.log(e.target);
                            forceUpdate();
                          }}
                          color="success"
                        />
                        <p style={{ paddingTop: 12 }}>{item.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ minWidth: "50%" }}>
              <div>
                {conditionRisk.map((item, index) => (
                  <div key={index}>
                    {index === 2 && (
                      <div className="d-flex">
                        <Checkbox
                          {...label}
                          onChange={(e) => {
                            console.log(e.target);
                            item.isChecked = !item.isChecked;
                            forceUpdate();
                          }}
                          color="success"
                        />
                        <p style={{ paddingTop: 12 }}>{item.name}</p>
                      </div>
                    )}
                    {item.isChecked && index === 2 && (
                      <div className="px-1">
                        <Input placeholder="lainnya" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h6>
            Potensi Bahaya - Deskripsi Insiden{" "}
            <span style={{ color: "red" }}>*</span>
          </h6>
          <Input
            style={{ minHeight: 100 }}
            type="textarea"
            name="potensiBahaya"
            value={formik.values.potensiBahaya}
            id="exampleText"
            rows="3"
            placeholder="Textarea"
          />
        </div>
        <div className="mt-2">
          <h6>
            Investigasi Nearmiss - deskripsi nearmiss{" "}
            <span style={{ color: "red" }}>*</span>
          </h6>
          <Input
            style={{ minHeight: 100 }}
            type="textarea"
            name="investigasiNearmiss"
            id="investigasiNearmiss"
            value={formik.values.investigasiNearmiss}
            rows="3"
            placeholder="Textarea"
          />
        </div>

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
                          onClick={() => setShowModalBuktiKejadian(true)}
                        >
                          <Plus size={18} />
                          <span className="align-middle ml-1 d-sm-inline-block d-none">
                            Bukti Kejadian
                          </span>
                        </Button.Ripple>
                      </div>

                      <Table responsive className="border" style={{}}>
                        <thead className="text-center">
                          <tr>
                            <th className="text-center">Action</th>
                            <th className="text-center">No</th>
                            <th className="text-center">Keterangan</th>
                            <th className="text-center">Nama File</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {formik.values.buktiKejadian.map((file, index) => (
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
                                      <Download className="mr-50" size={15} />
                                      <span className="align-middle">
                                        Download
                                      </span>
                                    </DropdownItem>
                                    <DropdownItem
                                      className="w-100"
                                      onClick={() => remove(index)}
                                      id="deleteBtn"
                                    >
                                      <Eye className="mr-50" size={15} />
                                      <span className="align-middle">View</span>
                                    </DropdownItem>
                                    <DropdownItem
                                      className="w-100"
                                      onClick={() => remove(index)}
                                      id="deleteBtn"
                                    >
                                      <Trash className="mr-50" size={15} />
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
                          ))}
                        </tbody>
                      </Table>

                      <FileUploadModal
                        show={showModalBuktiKejadian}
                        onHide={() => setShowModalBuktiKejadian(false)}
                        onFileUpload={(idFile, notes, fileName) => {
                          push({
                            idFile: idFile,
                            notes: notes,
                            fileName: fileName,
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
        </Row>

        <div className="mt-3">
          <h6>Tindakan Perbaikan</h6>
          <Paper elevation={6}>
            <div className="p-1" style={{ width: "90%" }}>
              <div className="mb-2">
                <div className="w-100">
                  <Button.Ripple
                    color="primary"
                    onClick={() => {
                      tindakanPerbaikan.push({
                        tindakan: "",
                        dueDate: "",
                        picCapa: "",
                        dept: "",
                        bukti: "",
                        isNew: true,
                      });
                      forceUpdate();
                    }}
                    className="cursor-pointer"
                  >
                    <Plus size={18} />
                    <span className="align-middle ml-1 d-sm-inline-block d-none">
                      Tindakan Perbaikan
                    </span>
                  </Button.Ripple>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default AddNewNearmiss;
