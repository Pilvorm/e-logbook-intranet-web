import React, { useState } from "react";
import { Paper } from "@mui/material";
import Apar from "./JenisPeralatan/Apar";
import JenisLain from "./JenisPeralatan/JenisLain";

const UpdateEquipmentData = (props) => {
  const { formik, token, viewOnly } = props;

  return (
    <div className="mt-2">
      <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
        Data {formik.values.jenisPeralatan}
      </h6>
      <Paper elevation={2}>
        {formik.values.jenisPeralatan === "APAR" ? (
          <Apar formik={formik} token={token} viewOnly={viewOnly}/>
        ) : formik.values.jenisPeralatan === "APD" ||
          formik.values.jenisPeralatan === "Spill Kit" ? (
          <JenisLain
            formik={formik}
            jenisPeralatan={formik.values.jenisPeralatan}
            viewOnly={viewOnly}
          />
        ) : null}
      </Paper>
    </div>
  );
};

export default UpdateEquipmentData;
