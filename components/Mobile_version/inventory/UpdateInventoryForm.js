import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Card,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import axios from "axios";
import moment from "moment";
import CustomDatePicker from "components/CustomFieldsFormik/CustomDatePicker";
import CustomSelect from "components/CustomFieldsFormik/CustomSelect";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import UpdateEquipmentData from "./UpdateEquipmentData";
import UpdateParameterInventory from "./UpdateParameterInventory";
import UpdateInventoryImage from "./UpdateInventoryImage";

const UpdateInventoryForm = (props) => {
  const { formik, token, sessionData, loadingPhoto, viewOnly = false } = props;
  
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
      <div className="">
        <Row>
          <Col sm="6">
            <CustomSelect
              id="lokasi"
              name={"lokasi"}
              options={lokasiOptions}
              label="Lokasi"
              formik={formik}
              onChangeValue={lokasiChangeHandler}
              initial={formik.values.lokasi}
              isDisabled={viewOnly}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <CustomSelect
              id="area"
              name={"area"}
              options={areaOptions}
              label="Area"
              formik={formik}
              onChangeValue={areaChangeHandler}
              initial={formik.values.area}
              isDisabled={viewOnly}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <FormGroup className="custom-input-select" md="6">
              <SelfCustomInput
                type="number"
                id="periodePengecekan"
                name={"periodePengecekan"}
                label="Periode Pengecekan"
                formik={formik}
                append="Bulan sekali"
                disabled={viewOnly}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="6"></Col>
          <Col sm="6">
            <CustomDatePicker
              id="tgl"
              label={"Tanggal Pengecekan"}
              name="tanggalPengecekan"
              formik={formik}
              disabled={viewOnly}
            />
          </Col>
        </Row>
        {formik.values.jenisPeralatan === "APD" ||
        formik.values.jenisPeralatan === "APAR" ||
        formik.values.jenisPeralatan === "Spill Kit" ? (
          <UpdateEquipmentData
            formik={formik}
            token={token}
            viewOnly={viewOnly}
          />
        ) : null}
        <UpdateParameterInventory formik={formik} viewOnly={viewOnly} />
        {/* <ParameterData formik={formik} /> */}
        {!loadingPhoto && (
          <UpdateInventoryImage formik={formik} viewOnly={viewOnly} />
        )}
      </div>
    </>
  );
};

export default UpdateInventoryForm;
