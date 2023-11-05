import React, { useState } from "react";
import { Button, Row, Col, FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Calendar } from "react-feather";
import EquipmentData from "./EquipmentData";
import ParameterData from "./ParameterData";
import InventoryImage from "./InventoryImage";

const DetailDataInventory = (props) => {
  const { dataDetailInventory } = props;
  const [jenisPeralatan, setJenisPeralatan] = useState({
    value: dataDetailInventory.kodeJenisPeralatan,
    label: dataDetailInventory.jenisPeralatan,
  });

  const dropdownOptions = [
    { value: "APD", label: "APD" },
    { value: "APAR", label: "APAR" },
    { value: "Spill Kit", label: "Spill Kit" },
    { value: "Hydrant", label: "Hydrant" },
    { value: "TOA", label: "TOA" },
    { value: "Lampu Emergency", label: "Lampu Emergency" },
  ];

  // const [dataDetailInventoryInventory] = useState([
  //     {
  //         name: "APAR TIANG",
  //         image: require("../../public/icons/apar_tiang.png")
  //     },
  //     {
  //         name: "APAR",
  //         image: require("../../public/icons/apar.png")
  //     },
  // ])
  return (
    <div className="mt-5">
      <Row>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Nomor Peralatan</Label>
            <Input
              type="text"
              placeholder="Nomor Peralatan"
              name="nomor_peralatan"
              value={dataDetailInventory.nomorPeralatan}
              disabled
            />
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Area</Label>
            <Input
              type="text"
              placeholder="Area"
              name="area"
              value={dataDetailInventory.area}
            ></Input>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Site</Label>
            <Input
              type="text"
              placeholder="Site"
              name="site"
              value={dataDetailInventory.site}
              disabled
            />
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Tanggal Pengecekan Terakhir</Label>
            <div className="form-control d-flex justify-content-between align-items-center pl-0">
              <DatePicker
                placeholderText="Placeholder"
                dateFormat="dd MMM yyyy"
                value="belum ada"
                showMonthDropdown
                showYearDropdown
                selected={new Date()}
                dropdownMode="select"
                className="form-control w-100 border-left-0 border-right-0"
              />
              <div className="mx-50"></div>
              <Calendar size={18} />
            </div>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Jenis Peralatan</Label>
            <Select
              classNamePrefix="select"
              placeholder={dataDetailInventory.type}
              options={dropdownOptions}
              value={jenisPeralatan}
              onChange={(a) => setJenisPeralatan(a)}
            ></Select>
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Tanggal Pengecekan Selanjutnya</Label>
            <div className="form-control d-flex justify-content-between align-items-center pl-0">
              <DatePicker
                placeholderText="Placeholder"
                value="belum ada"
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
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Lokasi</Label>
            <Input
              type="text"
              placeholder="Lokasi"
              name="lokasi"
              value={dataDetailInventory.lokasi}
            ></Input>
          </FormGroup>
        </Col>
        <Col sm="6">
          <FormGroup className="custom-input-select" md="6">
            <Label className="form-label">Status</Label>
            <Input
              type="text"
              placeholder="Status"
              name="status"
              value={dataDetailInventory.status}
            />
          </FormGroup>
        </Col>
      </Row>
      {jenisPeralatan.value === "APD" ||
      jenisPeralatan.value === "APAR" ||
      jenisPeralatan.value === "Spill Kit" ? (
        <EquipmentData
          jenisPeralatan={
            jenisPeralatan.value ? jenisPeralatan.value : jenisPeralatan
          }
        />
      ) : null}
      <ParameterData />
      <div className="mt-5">
        <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
          Gambar Inventory
        </h6>
        <InventoryImage data={dataDetailInventory.inventoryDetailGambar} />
      </div>
    </div>
  );
};

export default DetailDataInventory;
