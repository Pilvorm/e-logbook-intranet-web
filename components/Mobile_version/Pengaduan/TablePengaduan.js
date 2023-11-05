import { Button, Col, Row, Table } from "reactstrap";
import CameraModal from "components/CameraModal";
import { Fragment, useEffect, useState } from "react";
import { FieldArray, FormikProvider, useFormikContext } from "formik";
import { Trash2 } from "react-feather";
import { fetchImage } from "helpers/shared";
const TablePengaduan = ({ isCAPA, formik, viewOnly }) => {
  const [previewsFromAPI, setPreviewsFromAPI] = useState([]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const toggleCameraModal = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  const { values, errors, touched } = useFormikContext();
  const fotoPengaduans = values.fotoPengaduans;

  useEffect(() => {
    let isMounted = true; // A flag to check if the component is mounted

    async function fetchAndSetPreviewsFromAPI() {
      try {
        if (viewOnly) {
          const file = await Promise.all(
            fotoPengaduans.map(async (file) => {
              const response = await fetchImage(file.fileId);
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

  const errorFlag = Boolean(
    touched && touched?.fotoPengaduans && errors?.fotoPengaduans
  );

  return (
    <FormikProvider value={formik}>
      <FieldArray
        name={"fotoPengaduans"}
        render={(arrayHelpers) => {
          return (
            <Fragment>
              <Row className="mt-1 p-1">
                <Col>
                  <div className="mt-1">
                    {(!isCAPA && !viewOnly) && (
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
                        {(!isCAPA && !viewOnly) && <th>Actions</th>}
                        <th>No</th>
                        <th>Foto</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {values.fotoPengaduans.map((data, index) => (
                        <tr key={index}>
                          {(!isCAPA && !viewOnly) && (
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
                          <td>{(isCAPA || viewOnly) ? data?.keterangan : data?.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {errorFlag && (
                    <div className="text-danger" style={{ fontSize: "12px" }}>
                      {errors?.fotoPengaduans}
                    </div>
                  )}
                  <div className="mt-2"></div>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      />
    </FormikProvider>
  );
};

export default TablePengaduan;
