import { FieldArray, FormikProvider } from "formik";
import {
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
} from "reactstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import CustomSelect from "components/CustomFieldsFormik/CustomSelect";
import CustomDatePicker from "components/CustomFieldsFormik/CustomDatePicker";
const Apar = ({ formik, token, viewOnly }) => {
  const [mediaOptions, setMediaOptions] = useState([]);
  const hitGetLovMediaApar = async () => {
    await axios({
      url: "/api/Lov/mediaApar",
      method: "GET",
      headers: {
        AppAuthorization: token,
      },
    })
      .then((res) => {
        const data = res.data.data;
        const newData = data
          .map((x) => {
            return {
              value: x.namaMedia,
              label: x.namaMedia,
            };
          })
          .sort((a, b) => {
            const nameA = a.value.toUpperCase(); // ignore upper and lowercase
            const nameB = b.value.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });

        setMediaOptions(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(async () => {
    await hitGetLovMediaApar();
  }, []);

  return (
    <FormikProvider value={formik}>
      <FieldArray
        name="updateInventoryDetailApar"
        render={(arrayHelpers) => {
          return (
            <div className="p-2">
              {formik.values.updateInventoryDetailApar.map((item, index) => {
                return (
                  <>
                    <Row>
                      <Col sm="6">
                        <FormGroup className="custom-input-select" md="6">
                          <CustomSelect
                            id="mediaApar"
                            removeGap={true}
                            name={`updateInventoryDetailApar[${index}].media`}
                            options={mediaOptions}
                            label="Media"
                            // isBold={true}
                            formik={formik}
                            onChangeValue={(e) => {
                              if (e) {
                                formik.setFieldValue(
                                  `updateInventoryDetailApar[${index}].media`,
                                  e.value
                                );
                              } else {
                                formik.setFieldValue(
                                  `updateInventoryDetailApar[${index}].media`,
                                  ""
                                );
                              }
                            }}
                            initial={
                              formik.values["updateInventoryDetailApar"][index][
                                "media"
                              ]
                            }
                            isArrayOfObject={true}
                            mainField="updateInventoryDetailApar"
                            index={index}
                            keyObject="media"
                            isDisabled={viewOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup className="custom-input-select" md="6">
                          <SelfCustomInput
                            id="berat"
                            formik={formik}
                            label={"Berat"}
                            name={`updateInventoryDetailApar[${index}].berat`}
                            isArrayOfObject={true}
                            mainField="updateInventoryDetailApar"
                            index={index}
                            keyObject="berat"
                            disabled={viewOnly}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup className="custom-input-select" md="6">
                          <SelfCustomInput
                            id="merk"
                            formik={formik}
                            label={"Merk"}
                            name={`updateInventoryDetailApar[${index}].merk`}
                            isArrayOfObject={true}
                            mainField="updateInventoryDetailApar"
                            index={index}
                            keyObject="merk"
                            disabled={viewOnly}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <CustomDatePicker
                          formik={formik}
                          name={`updateInventoryDetailApar[${index}].tanggalEdTabung`}
                          label={"Tanggal ED Tabung"}
                          isArrayOfObject={true}
                          mainField="updateInventoryDetailApar"
                          index={index}
                          keyObject="tanggalEdTabung"
                          disabled={viewOnly}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <SelfCustomInput
                          id="kapasitas"
                          formik={formik}
                          label={"Kapasitas"}
                          name={`updateInventoryDetailApar[${index}].kapasitas`}
                          isArrayOfObject={true}
                          mainField="updateInventoryDetailApar"
                          index={index}
                          keyObject="kapasitas"
                          disabled={viewOnly}
                        />
                      </Col>
                      <Col sm="6"></Col>
                    </Row>
                  </>
                );
              })}
            </div>
          );
        }}
      />
    </FormikProvider>
  );
};

export default Apar;
