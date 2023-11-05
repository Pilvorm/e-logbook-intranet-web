import CameraModal from "components/CameraModal";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import { FieldArray, FormikProvider, useFormikContext } from "formik";
import { fetchImage } from "helpers/shared";
import { Fragment, useEffect, useState } from "react";
import { Trash2 } from "react-feather";
import { Button, Col, Row, Table } from "reactstrap";

const CapaInspection = ({ index, name, formik, viewOnly }) => {
  const { values, errors, touched } = useFormikContext();
  const lampiranCAPAParameterInspeksi =
    values.parameterInspeksi[index].lampiranCAPAParameterInspeksi;

  const errorFlag = Boolean(
    touched &&
      touched?.parameterInspeksi &&
      errors?.parameterInspeksi &&
      errors?.parameterInspeksi[index] &&
      errors?.parameterInspeksi[index].lampiranCAPAParameterInspeksi
  );

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const toggleCameraModal = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (viewOnly) {
          const file = await Promise.all(
            lampiranCAPAParameterInspeksi.map(async (file) => {
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
                <Row className="mt-1">
                  <Col>
                    <>
                      <div>
                        <strong style={{ color: "green" }}>CAPA</strong>
                      </div>
                      <SelfCustomInput
                        //   type="textarea"
                        label={"Tindak Lanjut"}
                        formik={formik}
                        isArrayOfObject={true}
                        name={`parameterInspeksi[${index}].tindakLanjutCAPA`}
                        mainField={"parameterInspeksi"}
                        index={index}
                        keyObject={"tindakLanjutCAPA"}
                        disabled={viewOnly}
                      />
                      <div className="mt-1">
                        {!viewOnly && (
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
                            {!viewOnly && <th>Actions</th>}
                            <th>No</th>
                            <th>Foto</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {lampiranCAPAParameterInspeksi.map((data, index) => (
                            <tr key={index}>
                              {!viewOnly && (
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
                                    viewOnly
                                      ? previewsFromAPI[index]
                                      : data?.photo
                                      ? data?.photo
                                      : null
                                  }
                                  alt={`Captured ${index + 1}`}
                                  width="100"
                                />
                              </td>
                              <td>
                                {viewOnly ? data?.keterangan : data?.notes}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {errorFlag && (
                        <div
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {
                            errors.parameterInspeksi[index]
                              .lampiranCAPAParameterInspeksi
                          }
                        </div>
                      )}
                      <div className="mt-2">
                        <SelfCustomInput
                          type="textarea"
                          label={"Keterangan"}
                          formik={formik}
                          isArrayOfObject={true}
                          name={`parameterInspeksi[${index}].keteranganCAPA`}
                          mainField={"parameterInspeksi"}
                          index={index}
                          keyObject={"keteranganCAPA"}
                          disabled={viewOnly}
                        />
                      </div>
                    </>
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

export default CapaInspection;
