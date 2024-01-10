import { FieldArray, FormikProvider } from "formik";
import { Fragment, useState } from "react";
import { Button } from "reactstrap";
import ParameterModal from "../Modal/AddModal";
import InspectionItem from "./InspectionItem";

const ParameterInspeksi = ({ formik, isCAPA, viewOnly }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const errorFlag = Boolean(
    formik.touched &&
      formik.errors &&
      formik.touched.parameterInspeksi &&
      formik.errors.parameterInspeksi &&
      typeof formik.errors.parameterInspeksi === "string"
  );

  return (
    <FormikProvider value={formik}>
      <FieldArray
        name={"parameterInspeksi"}
        render={(arrayHelpers) => {
          return (
            <Fragment>
              {!isCAPA && !viewOnly && (
                <Button color="primary" onClick={toggleModal}>
                  Add Parameter
                </Button>
              )}
              {errorFlag && (
                <div className="text-danger" style={{ fontSize: "12px" }}>
                  {formik.errors.parameterInspeksi}
                </div>
              )}
              {formik.values.parameterInspeksi?.map((param, index) => (
                <InspectionItem
                  key={index}
                  title={param.namaParameter}
                  onDelete={() => arrayHelpers.remove(index)}
                  formik={formik}
                  name={`parameterInspeksi[${index}].lampiranParameterInspeksi`}
                  index={index}
                  isCAPA={isCAPA}
                  viewOnly={viewOnly}
                />
              ))}
              <ParameterModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                addParameter={(value) => {
                  const newValue = {
                    namaParameter: value,
                    statusIsOk: true,
                    catatan: "",
                    tindakLanjutCAPA: "",
                    keteranganCAPA: "",
                    lampiranParameterInspeksi: [],
                    lampiranCAPAParameterInspeksi: [],
                    isDeletable: true,
                  };
                  arrayHelpers.push(newValue);
                }}
              />
            </Fragment>
          );
        }}
      />
    </FormikProvider>
  );
};

export default ParameterInspeksi;
