import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import MyCustomReactSelect from "components/CustomFieldsFormik/CustomSelect";
import { FieldArray, FormikProvider } from "formik";
import { Fragment, useState } from "react";
import { Trash, Camera, RotateCw } from "react-feather";
import { Col, CustomInput, Label, Row, Table } from "reactstrap";
import CameraModalForAPD from "../Modal/CameraModalForAPD";
import PhotoContainer from "./PhotoContainer";
import PhotoContainerCapa from "./PhotoContainerCapa";

const ParameterAPD = ({ formik, isCAPA, viewOnly }) => {
  const statusOption = [
    { value: true, label: "Ok" },
    { value: false, label: "Not Ok" },
  ];

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [indexArray, setIndexArray] = useState(0);
  const toggleCameraModal = (index) => {
    setIsCameraOpen(!isCameraOpen);
    setIndexArray(index);
  };

  const resetHandler = (detail, index) => {
    formik.setFieldValue(`detailJenis[${index}].jumlahAktual`, detail.jumlah);
    formik.setFieldValue(`detailJenis[${index}].status`, true);
    formik.setFieldValue(`detailJenis[${index}].keterangan`, "");
    formik.setFieldValue(`detailJenis[${index}].photo`, "");
  };

  return (
    <FormikProvider value={formik}>
      <FieldArray
        name={"detailJenis"}
        render={(arrayHelpers) => {
          return (
            <Fragment>
              {formik.values.detailJenis.map((detail, index) => {
                return (
                  <>
                    <Row className="mt-1 border rounded p-2 w-100">
                      <div className="w-100">
                        <Row className="d-flex justify-content-between">
                          <h3 className="text-primary">
                            {formik.values.detailJenis[index].jenis}
                          </h3>
                          {!isCAPA && !viewOnly && (
                            <RotateCw
                              onClick={() => {
                                resetHandler(detail, index);
                              }}
                              cursor="pointer"
                              color="red"
                              className="mr-1"
                            />
                          )}
                        </Row>
                        <Row>
                          <div className="ml-1 mt-1">
                            <h4>Status</h4>
                            <CustomInput
                              disabled={isCAPA || viewOnly}
                              type="radio"
                              className="custom-control-Primary"
                              name={`detailJenis[${index}].status`}
                              checked={
                                formik.values.detailJenis[index].status === true
                              }
                              onChange={() => {
                                formik.setFieldValue(
                                  `detailJenis[${index}].status`,
                                  true
                                );
                              }}
                              value={Boolean(true)}
                              label="OK"
                              id={`detailJenis[${index}].statusIsOktrue`}
                              inline
                            />
                            <CustomInput
                              disabled={isCAPA || viewOnly}
                              type="radio"
                              className="custom-control-Primary"
                              name={`detailJenis[${index}].status`}
                              checked={
                                formik.values.detailJenis[index].status ===
                                false
                              }
                              onChange={() => {
                                formik.setFieldValue(
                                  `detailJenis[${index}].status`,
                                  false
                                );
                              }}
                              value={false}
                              label="NOT OK"
                              id={`detailJenis[${index}].statusIsOkfalse`}
                              inline
                            />
                          </div>
                        </Row>
                        <Row className="m-0 mt-1">
                          <Col xs="4" className="p-0">
                            <SelfCustomInput
                              type="number"
                              formik={formik}
                              label="Jumlah"
                              name={`detailJenis[${index}].jumlah`}
                              isArrayOfObject={true}
                              mainField="detailJenis"
                              index={index}
                              keyObject="jumlah"
                              disabled={true}
                              onChange={(e) => {
                                console.log(e);
                              }}
                            />
                          </Col>
                          <Col xs="8" className="pr-0">
                            <SelfCustomInput
                              type="number"
                              formik={formik}
                              label="Jumlah Aktual"
                              name={`detailJenis[${index}].jumlahAktual`}
                              isArrayOfObject={true}
                              mainField="detailJenis"
                              index={index}
                              keyObject="jumlahAktual"
                              disabled={viewOnly || isCAPA}
                              onChange={(e) => {
                                console.log(e);
                              }}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col>
                            <SelfCustomInput
                              formik={formik}
                              label="Keterangan"
                              name={`detailJenis[${index}].keterangan`}
                              isArrayOfObject={true}
                              mainField="detailJenis"
                              index={index}
                              keyObject="keterangan"
                              disabled={viewOnly || isCAPA}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col>
                            <Label>Foto</Label>
                            <div className="d-flex justify-content-center">
                              <PhotoContainer
                                toggleCameraModal={toggleCameraModal}
                                index={index}
                                detail={detail}
                                formik={formik}
                                isCAPA={isCAPA}
                                viewOnly={viewOnly}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="w-100 mt-3">
                        {formik.values.detailJenis[index].status === false &&
                        (isCAPA || viewOnly) ? (
                          <>
                            <Row className="d-flex justify-content-between">
                              <h3 className="text-primary">CAPA</h3>
                            </Row>
                            <Row className="mt-1">
                              <Col>
                                <SelfCustomInput
                                  formik={formik}
                                  label="Tindak Lanjut"
                                  name={`detailJenis[${index}].tindakLanjut`}
                                  isArrayOfObject={true}
                                  mainField="detailJenis"
                                  index={index}
                                  keyObject="tindakLanjut"
                                  disabled={viewOnly}
                                />
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col>
                                <Label>Foto</Label>
                                <div className="d-flex justify-content-center">
                                  <PhotoContainerCapa
                                    index={index}
                                    detail={detail}
                                    formik={formik}
                                    isCAPA={isCAPA}
                                    viewOnly={viewOnly}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-1">
                              <Col>
                                <SelfCustomInput
                                  type="textarea"
                                  formik={formik}
                                  label="Keterangan"
                                  name={`detailJenis[${index}].keteranganCapa`}
                                  isArrayOfObject={true}
                                  mainField="detailJenis"
                                  index={index}
                                  keyObject="keteranganCapa"
                                  disabled={viewOnly}
                                />
                              </Col>
                            </Row>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Row>
                  </>
                );
              })}

              <CameraModalForAPD
                isOpen={isCameraOpen}
                toggle={toggleCameraModal}
                onCapture={(photo) => {
                  formik.setFieldValue(
                    `detailJenis[${indexArray}].photo`,
                    photo.photo
                  );
                }}
              />
            </Fragment>
          );
        }}
      />
    </FormikProvider>
  );
};

export default ParameterAPD;
