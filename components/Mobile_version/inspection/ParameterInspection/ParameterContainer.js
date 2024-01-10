import { FieldArray, FormikProvider } from "formik";
import { Fragment, useState } from "react";
import { Button } from "reactstrap";
import ParameterModal from "../Modal/AddModal";
import InspectionItem from "./InspectionItem";
import ParameterAPD from "./ParameterAPD";
import ParameterInspeksi from "./ParameterInspeksi";

const ParameterContainer = ({ formik, isCAPA, viewOnly }) => {
  const errorFlag = Boolean(
    formik.touched &&
      formik.errors &&
      formik.touched.parameterInspeksi &&
      formik.errors.parameterInspeksi &&
      typeof formik.errors.parameterInspeksi === "string"
  );
  return (
    <Fragment>
      {formik.values.jenisPeralatan === "APD" ? (
        <ParameterAPD formik={formik} isCAPA={isCAPA} viewOnly={viewOnly} />
      ) : (
        <ParameterInspeksi
          formik={formik}
          isCAPA={isCAPA}
          viewOnly={viewOnly}
        />
      )}
    </Fragment>
  );
};

export default ParameterContainer;
