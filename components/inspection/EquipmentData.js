import React, { useState } from "react";
import { Table, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Calendar, Plus } from "react-feather";
import { Paper } from "@mui/material";
import ParameterData from "./ParameterData";
import { FieldArray, FormikProvider } from "formik";
import Apar from "./JenisPeralatan/Apar";
import JenisLain from "./JenisPeralatan/JenisLain";

const EquipmentData = (props) => {
  const { jenisPeralatan, formik, token } = props;

  const dropdownOptions = [
    { value: "CO2", label: "CO2" },
    { value: "Foam", label: "Foam" },
    { value: "Dry Chemical", label: "Dry Chemical" },
    { value: "AF11", label: "AF11" },
  ];
  return (
    <div className="mt-5">
      <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
        Data {jenisPeralatan}
      </h6>
      <Paper elevation={2}>
        {jenisPeralatan === "APAR" ? (
          <Apar formik={formik} token={token} />
        ) : jenisPeralatan === "APD" || jenisPeralatan === "Spill Kit" ? (
          <JenisLain formik={formik} jenisPeralatan={jenisPeralatan} />
        ) : null}
      </Paper>
    </div>
  );
};

export default EquipmentData;
