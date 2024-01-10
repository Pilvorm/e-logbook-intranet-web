import React, { Fragment, useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import CameraModal from "components/CameraModal";
import { FieldArray, FormikProvider, useFormikContext } from "formik";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import { fetchImage } from "helpers/shared";
import CapaInspection from "./CapaInspection";

const InspectionItem = ({ title, onDelete, name, formik, index, isCAPA, viewOnly }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const toggleCameraModal = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  const { values, errors, touched } = useFormikContext();
  const lampiranParameterInspeksi =
    values.parameterInspeksi[index].lampiranParameterInspeksi;
  const isDeletable =
    values.parameterInspeksi[index].isDeletable;

  const statusIsOk = values.parameterInspeksi[index].statusIsOk;

  const errorFlag = Boolean(
    touched &&
      touched?.parameterInspeksi &&
      errors?.parameterInspeksi &&
      errors?.parameterInspeksi[index] &&
      errors?.parameterInspeksi[index].lampiranParameterInspeksi
  );

  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (isCAPA) {
          const file = await Promise.all(
            lampiranParameterInspeksi.map(async (file) => {
              const response = await fetchImage(file.idFile);
              if (response != null) {
                return response;
              } else {
                return "";
              }
            })
          );

          // Check if the component is still mounted before updating the state
          if (isMounted) {
            setPreviewsFromAPI(file);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchAndSetPreviewsFromAPI();

    // Cleanup function to cancel any pending asynchronous tasks
    return () => {
      isMounted = false; // Set the flag to indicate that the component is unmounted
    };
  }, []);

  return (
    <div className="mt-2 d-flex flex-column w-100">
      <FormikProvider value={formik}>
        <FieldArray
          name={name}
          render={(arrayHelpers) => {
            return (
              <Fragment>
                <div>
                  {(!isCAPA && !viewOnly && isDeletable) && (
                    <Trash2 color="red" className="mr-1" onClick={onDelete} />
                  )}
                  <h3 style={{ color: "green" }}>{title}</h3>
                </div>
                <Row className="mt-1 border rounded p-2">
                  <Col>
                    <h4>Status</h4>
                  </Col>
                  <Col>
                    <div>
                      <CustomInput
                        disabled={isCAPA || viewOnly}
                        type="radio"
                        className="custom-control-Primary"
                        name={`parameterInspeksi[${index}].statusIsOk`}
                        checked={
                          values.parameterInspeksi[index].statusIsOk === true
                        }
                        onChange={() => {
                          formik.setFieldValue(
                            `parameterInspeksi[${index}].statusIsOk`,
                            true
                          );
                        }}
                        value={Boolean(true)}
                        label="OK"
                        id={`parameterInspeksi[${index}].statusIsOktrue`}
                        inline
                      />
                      <CustomInput
                        disabled={isCAPA || viewOnly}
                        type="radio"
                        className="custom-control-Primary"
                        name={`parameterInspeksi[${index}].statusIsOk`}
                        checked={
                          values.parameterInspeksi[index].statusIsOk === false
                        }
                        onChange={() => {
                          formik.setFieldValue(
                            `parameterInspeksi[${index}].statusIsOk`,
                            false
                          );
                        }}
                        value={false}
                        label="NOT OK"
                        id={`parameterInspeksi[${index}].statusIsOkfalse`}
                        inline
                      />
                    </div>
                    <div className="mt-1">
                      {!isCAPA && (
                        <Button color="info" onClick={toggleCameraModal}>
                          Open Camera
                        </Button>
                      )}
                      <CameraModal
                        isOpen={isCameraOpen}
                        toggle={toggleCameraModal}
                        onCapture={(photo) => arrayHelpers.push(photo)}
                      />
                    </div>
                    <Table responsive>
                      <thead className="text-center">
                        <tr>
                          {!isCAPA && <th>Actions</th>}
                          <th>No</th>
                          <th>Foto</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {lampiranParameterInspeksi.map((data, index) => (
                          <tr key={index}>
                            {!isCAPA && (
                              <td>
                                <Trash2
                                  onClick={() => arrayHelpers.remove(index)}
                                  color="red"
                                />
                              </td>
                            )}
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={
                                  (isCAPA || viewOnly)
                                    ? previewsFromAPI[index]
                                    : data?.photo
                                    ? data?.photo
                                    : null
                                }
                                alt={`Captured ${index + 1}`}
                                width="100"
                              />
                            </td>
                            <td>{isCAPA ? data?.keterangan : data?.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {errorFlag && (
                      <div className="text-danger" style={{ fontSize: "12px" }}>
                        {
                          errors.parameterInspeksi[index]
                            .lampiranParameterInspeksi
                        }
                      </div>
                    )}
                    <div className="mt-2">
                      <SelfCustomInput
                        type="textarea"
                        label={"Catatan"}
                        formik={formik}
                        isArrayOfObject={true}
                        name={`parameterInspeksi[${index}].catatan`}
                        mainField={"parameterInspeksi"}
                        index={index}
                        keyObject={"catatan"}
                        disabled={isCAPA || viewOnly}
                      />
                    </div>
                    {(isCAPA || viewOnly) && !statusIsOk && (
                      <>
                        <CapaInspection
                          name={`parameterInspeksi[${index}].lampiranCAPAParameterInspeksi`}
                          index={index}
                          formik={formik}
                          viewOnly={viewOnly}
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </Fragment>
            );
          }}
        />
      </FormikProvider>
    </div>
  );
};

export default InspectionItem;
