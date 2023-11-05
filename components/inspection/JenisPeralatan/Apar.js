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
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Calendar } from "react-feather";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import CustomSelect from "components/CustomFieldsFormik/CustomSelect";
import CustomDatePicker from "components/CustomFieldsFormik/CustomDatePicker";
const Apar = ({ formik, token }) => {
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

  const dropdownOptions = [
    { value: "CO2", label: "CO2" },
    { value: "Foam", label: "Foam" },
    { value: "Dry Chemical", label: "Dry Chemical" },
    { value: "AF11", label: "AF11" },
  ];
  return (
    <FormikProvider value={formik}>
      <FieldArray
        name="inventoryDetailApar"
        render={(arrayHelpers) => {
          return (
            <div className="p-2">
              {formik.values.inventoryDetailApar.map((item, index) => {
                return (
                  <>
                    <Row>
                      <Col sm="6">
                        <FormGroup className="custom-input-select" md="6">
                          <CustomSelect
                            id="mediaApar"
                            name={`inventoryDetailApar[${index}].media`}
                            options={mediaOptions}
                            label="Media"
                            formik={formik}
                            onChangeValue={(e) => {
                              if (e) {
                                formik.setFieldValue(
                                  `inventoryDetailApar[${index}].media`,
                                  e.value
                                );
                              }else{
                                formik.setFieldValue(
                                  `inventoryDetailApar[${index}].media`,
                                  ""
                                );

                              }
                            }}
                            initial={
                              formik.values["inventoryDetailApar"][index][
                                "media"
                              ]
                            }
                            isArrayOfObject={true}
                            mainField="inventoryDetailApar"
                            index={index}
                            keyObject="media"
                            isDisabled={
                              formik.values.status.includes("approval") ||
                              formik.values.status.includes("Approved") ||
                              formik.values.status.includes("Rejected")
                                ? true
                                : false
                            }
                          />
                          {/* <Label className="form-label">Media</Label>
                          <Select
                            name={`inventoryDetailApar[${index}].media`}
                            classNamePrefix="select"
                            placeholder=""
                            options={mediaOptions}
                            onChange={(e) =>
                              formik.setFieldValue(
                                `inventoryDetailApar[${index}].media`,
                                e.value
                              )
                            }
                            value={{
                              value:
                                formik.values.inventoryDetailApar[index].media,
                              label:
                                formik.values.inventoryDetailApar[index].media,
                            }}
                          ></Select>
                          {formik.errors.inventoryDetailApar &&
                          formik.touched.inventoryDetailApar &&
                          formik.errors.inventoryDetailApar[index]?.media ? (
                            <div className="text-danger">
                              {formik.errors.inventoryDetailApar[index]?.media}
                            </div>
                          ) : null} */}
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <SelfCustomInput
                          id="berat"
                          formik={formik}
                          label={"Berat"}
                          name={`inventoryDetailApar[${index}].berat`}
                          isArrayOfObject={true}
                          mainField="inventoryDetailApar"
                          index={index}
                          keyObject="berat"
                          disabled={
                            formik.values.status.includes("approval") ||
                            formik.values.status.includes("Approved") ||
                            formik.values.status.includes("Rejected")
                              ? true
                              : false
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        {/* <FormGroup className="custom-input-select" md="6">
                          <Label className="form-label">Merk</Label>
                          <Input
                            type="text"
                            placeholder=""
                            value={item.merk}
                            name={`inventoryDetailApar[${index}].merk`}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.inventoryDetailApar &&
                          formik.touched.inventoryDetailApar &&
                          formik.errors.inventoryDetailApar[index]?.merk ? (
                            <div className="text-danger">
                              {formik.errors.inventoryDetailApar[index]?.merk}
                            </div>
                          ) : null}
                        </FormGroup> */}
                        <SelfCustomInput
                          id="merk"
                          formik={formik}
                          label={"Merk"}
                          name={`inventoryDetailApar[${index}].merk`}
                          isArrayOfObject={true}
                          mainField="inventoryDetailApar"
                          index={index}
                          keyObject="merk"
                          disabled={
                            formik.values.status.includes("approval") ||
                            formik.values.status.includes("Approved") ||
                            formik.values.status.includes("Rejected")
                              ? true
                              : false
                          }
                        />
                      </Col>
                      <Col sm="6">
                        {/* <FormGroup className="custom-input-select" md="6">
                          <Label className="form-label">
                            Tanggal ED Tabung
                          </Label>
                          <InputGroup>
                            <div className="form-control d-flex justify-content-between align-items-center pl-0">
                              <DatePicker
                                name={`inventoryDetailApar[${index}].tanggalEdTabung`}
                                placeholderText=""
                                value={item.tanggalEdTabung}
                                selected={Date.parse(
                                  moment(item.tanggalEdTabung).format(
                                    "D MMM yyyy"
                                  )
                                )}
                                dateFormat="dd MMM yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className="form-control w-100 border-left-0 border-right-0"
                                onChange={(date) => {
                                  console.log(date);
                                  formik.setFieldValue(
                                    `inventoryDetailApar[${index}].tanggalEdTabung`,
                                    date
                                  );
                                }}
                              />
                              <InputGroupAddon>
                                <Calendar size={18} />
                              </InputGroupAddon>
                            </div>
                          </InputGroup>
                          {formik.errors.inventoryDetailApar &&
                          formik.touched.inventoryDetailApar &&
                          formik.errors.inventoryDetailApar[index]
                            ?.tanggalEdTabung ? (
                            <div className="text-danger">
                              {
                                formik.errors.inventoryDetailApar[index]
                                  ?.tanggalEdTabung
                              }
                            </div>
                          ) : null}
                        </FormGroup> */}
                        <CustomDatePicker
                          formik={formik}
                          name={`inventoryDetailApar[${index}].tanggalEdTabung`}
                          label={"Tanggal ED Tabung"}
                          isArrayOfObject={true}
                          mainField="inventoryDetailApar"
                          index={index}
                          keyObject="tanggalEdTabung"
                          disabled={
                            formik.values.status.includes("approval") ||
                            formik.values.status.includes("Approved") ||
                            formik.values.status.includes("Rejected")
                              ? true
                              : false
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        {/* <FormGroup className="custom-input-select" md="6">
                          <Label className="form-label">Kapasitas</Label>
                          <Input
                            type="text"
                            placeholder=""
                            name={`inventoryDetailApar[${index}].kapasitas`}
                            value={item.kapasitas}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.inventoryDetailApar &&
                          formik.touched.inventoryDetailApar &&
                          formik.errors.inventoryDetailApar[index]
                            ?.kapasitas ? (
                            <div className="text-danger">
                              {
                                formik.errors.inventoryDetailApar[index]
                                  ?.kapasitas
                              }
                            </div>
                          ) : null}
                        </FormGroup> */}
                        <SelfCustomInput
                          id="kapasitas"
                          formik={formik}
                          label={"Kapasitas"}
                          name={`inventoryDetailApar[${index}].kapasitas`}
                          isArrayOfObject={true}
                          mainField="inventoryDetailApar"
                          index={index}
                          keyObject="kapasitas"
                          disabled={
                            formik.values.status.includes("approval") ||
                            formik.values.status.includes("Approved") ||
                            formik.values.status.includes("Rejected")
                              ? true
                              : false
                          }
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
