import React, { useEffect, useState } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import EquipmentData from "./EquipmentData";
import ParameterData from "./ParameterData";
import InventoryImage from "./InventoryImage";
import axios from "axios";
import CustomDatePicker from "components/CustomFieldsFormik/CustomDatePicker";
import CustomSelect from "components/CustomFieldsFormik/CustomSelect";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";

const AddNewP3K = (props) => {
  const { formik, token, imageList, setImageList, sessionData, imageError } =
    props;

  //Jenis Peralatan UTILS SECTION #Masih di hardcode karena data master masih kosong
  const [jenisPeralatan, setJenisPeralatan] = useState({
    value: "",
  });
  const [jenisPeralatanOptions, setJenisPeralatanOptions] = useState([]);
  const [selectedJenisPeralatan, setSelectedJenisPeralatan] = useState(null);
  //Function untuk get Lov Lokasi dari master Lokasi
  const hitGetLovJenisPeralatan = async () => {
    await axios({
      url: "/api/Lov/jenisPeralatan",
      method: "GET",
      headers: {
        AppAuthorization: token,
      },
    })
      .then((res) => {
        const data = res.data.data;
        const newData = data
          .map((x) => {
            return {
              value: JSON.stringify({
                kode: x.kode,
                jenisPeralatan: x.jenisPeralatan,
              }),
              label: x.jenisPeralatan,
            };
          })
          .sort((a, b) => {
            const nameA = a.label.toUpperCase(); // ignore upper and lowercase
            const nameB = b.label.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });

        setJenisPeralatanOptions(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Dropdown Jenis Peralatan Change Handler
  const jenisPeralatanChangeHandler = (data) => {
    // console.log(data);

    if (data) {
      const newData = JSON.parse(data.value);
      console.log(newData);

      formik.setFieldValue("inventoryDetailJenis", []);
      if (newData.jenisPeralatan == "APAR") {
        formik.setFieldValue("inventoryDetailApar", [
          {
            media: "",
            merk: "",
            kapasitas: "",
            berat: "0",
            tanggalEdTabung: "",
          },
        ]);
      } else {
        formik.setFieldValue("inventoryDetailApar", []);
      }
      formik.setFieldValue("jenisPeralatan", newData.jenisPeralatan);
      formik.setFieldValue("kodeJenisPeralatan", newData.kode);
      setJenisPeralatan({
        value: newData.jenisPeralatan,
      });
    } else {
      formik.setFieldValue("jenisPeralatan", "");
      formik.setFieldValue("kodeJenisPeralatan", "");
      setJenisPeralatan({
        value: "",
      });
    }
  };

  //LOKASI UTILS SECTION
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
    if (data) {
      formik.setFieldValue("lokasi", data.value);
    } else {
      formik.setFieldValue("lokasi", "");
    }
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
    if (data) {
      formik.setFieldValue("area", data.value);
    } else {
      formik.setFieldValue("area", "");
    }
  };

  useEffect(async () => {
    await hitGetLovArea();
    await hitGetLovLokasi();
    await hitGetLovJenisPeralatan();
    setSelectedJenisPeralatan({
      value: formik.values.jenisPeralatan,
      label: formik.values.jenisPeralatan,
    });
    setJenisPeralatan({
      value: formik.values.jenisPeralatan,
      label: formik.values.jenisPeralatan,
    });
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
                placeholder=""
                name="nomor_peralatan"
                value={formik.values.nomorPeralatan}
                disabled
              />
            </FormGroup>
          </Col>
          <Col sm="6">
            <CustomSelect
              name={"lokasi"}
              options={lokasiOptions}
              label="Lokasi"
              formik={formik}
              onChangeValue={lokasiChangeHandler}
              initial={formik.values.lokasi}
              isDisabled={
                formik.values.status.includes("approval") ||
                formik.values.status.includes("Approved") ||
                formik.values.status.includes("Rejected")
                  ? true
                  : false
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <FormGroup className="custom-input-select" md="6">
              <Label className="form-label">Company</Label>
              <Input
                type="text"
                placeholder=""
                name="site"
                value={formik.values.companyName}
                disabled
              />
            </FormGroup>
          </Col>
          <Col sm="6">
            <CustomSelect
              name={"area"}
              options={areaOptions}
              label="Area"
              formik={formik}
              onChangeValue={areaChangeHandler}
              initial={formik.values.area}
              isDisabled={
                formik.values.status.includes("approval") ||
                formik.values.status.includes("Approved") ||
                formik.values.status.includes("Rejected")
                  ? true
                  : false
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <CustomSelect
              isDisabled={
                formik.values.status.includes("approval") ||
                formik.values.status.includes("Approved") ||
                formik.values.status.includes("Rejected")
                  ? true
                  : false
              }
              name={"jenisPeralatan"}
              options={jenisPeralatanOptions}
              label="Jenis Peralatan"
              formik={formik}
              onChangeValue={jenisPeralatanChangeHandler}
              initial={formik.values.jenisPeralatan}
            />
          </Col>
          <Col sm="6">
            <FormGroup className="custom-input-select" md="6">
              {/* <Label className="form-label">Periode Pengecekan</Label> */}
              <SelfCustomInput
                disabled={
                  formik.values.status.includes("approval") ||
                  formik.values.status.includes("Approved") ||
                  formik.values.status.includes("Rejected")
                    ? true
                    : false
                }
                type="number"
                name={"periodePengecekan"}
                label="Periode Pengecekan"
                formik={formik}
                append="Bulan sekali"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="6"></Col>
          <Col sm="6">
            <CustomDatePicker
              label={"Tanggal Pengecekan"}
              name="tanggalPengecekan"
              formik={formik}
              disabled={
                formik.values.status.includes("approval") ||
                formik.values.status.includes("Approved") ||
                formik.values.status.includes("Rejected")
                  ? true
                  : false
              }
            />
          </Col>
        </Row>
        {jenisPeralatan.value === "APD" ||
        jenisPeralatan.value === "APAR" ||
        jenisPeralatan.value === "Spill Kit" ? (
          <EquipmentData
            jenisPeralatan={
              jenisPeralatan.value ? jenisPeralatan.value : jenisPeralatan
            }
            formik={formik}
            token={token}
          />
        ) : null}
        <ParameterData formik={formik} />
        <div className="mt-5">
          <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
            Gambar Inventory
          </h6>
          <InventoryImage
            imageList={imageList}
            setImageList={setImageList}
            formik={formik}
            imageError={imageError}
          />
        </div>
      </div>
    </>
  );
};

export default AddNewP3K;
