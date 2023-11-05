import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Card,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import Select from "react-select";
import { Calendar, Table } from "react-feather";
import { TableCell } from "@mui/material";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import CustomFormLov from "components/Lov/CustomFormLov";
import moment from "moment";
import CustomDatePicker from "components/CustomFieldsFormik/CustomDatePicker";
import CustomSelect from "components/CustomFieldsFormik/CustomSelect";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import EmployeeData from "./EmployeeData";

import AsyncSelect from "react-select/async";
import { FieldArray, Formik, useFormik } from "formik";
import FormikInput from "components/CustomInputs/CustomInput";
import CustomRadio from "components/CustomInputs/CustomRadio";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import FormikHourPicker from "components/CustomInputs/CustomHourPicker";
import * as yup from "yup";

import { getAsyncOptionsSBU } from "helpers/sbu";
import debounce from "lodash/debounce";

const AddNewReport = (props) => {
  const { formik, dataSBU, token } = props;

  const loadOptionsSBU = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsSBU(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const incidentType = [
    { value: "Kecelakaan", label: "Kecelakaan" },
    { value: "Penyebab Akibat Kerja", label: "Penyebab Akibat Kerja" },
  ];

  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col md="6">
            <FormGroup tag={Col} md="12">
              <Label className="form-label font-weight-bold">
                Nomor Dokumen
              </Label>
              <Input
                type="text"
                placeholder="Document Number"
                // value={selectedName?.userPrincipalName}
                defaultValue={""}
                formik={formik}
                onChange={formik.handleChange("nomorDokumen")}
              />
              {formik.errors.userPrincipalName && (
                <div className="text-danger">{formik.errors.userPrincipalName}</div>
              )}
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup tag={Col} md="12">
              <Label className="form-label font-weight-bold">Creator</Label>
              <Input
                type="text"
                placeholder="Creator"
                // value={selectedName?.userPrincipalName}
                defaultValue={""}
                formik={formik}
                onChange={formik.handleChange("creator")}
              />
              {formik.errors.userPrincipalName && (
                <div className="text-danger">{formik.errors.userPrincipalName}</div>
              )}
            </FormGroup>
          </Col>
          <Col md="6"></Col>
        </Row>

        <Row>
          <Col md="6">
            <FormGroup tag={Col} md="12">
              <Label className="form-label font-weight-bold">Company</Label>
              <AsyncSelect
                id="company"
                name="site"
                classNamePrefix="select"
                cacheOptions
                formik={formik}
                defaultOptions={dataSBU}
                loadOptions={loadOptionsSBU}
                onChange={(e) => {
                  formik.setFieldValue("site", e.idmCompName);
                  setSelectedCompany(e);
                }}
              />
            </FormGroup>
            <FormGroup tag={Col} md="12">
              <Label className="form-label font-weight-bold">
                Jenis Insiden
              </Label>
              <CustomRadio
                name="jenisInsiden"
                formik={formik}
                options={incidentType}
                isRow={true}
              />
              {formik.errors.userPrincipalName && (
                <div className="text-danger">{formik.errors.userPrincipalName}</div>
              )}
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup tag={Col} md="12">
              <FormikInput
                type="textarea"
                label="Aktivitas / Kegiatan Korban di Lokasi"
                name="aktivitasKorban"
                formik={formik}
                placeholder=""
                height="114px"
                isRequired
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Row>
              <Col md="6">
                <FormGroup tag={Col} md="12">
                  <FormikDatePicker
                    label="Tanggal Kejadian"
                    name="tglKecelakaan"
                    formik={formik}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup tag={Col} md="12">
                  <FormikHourPicker
                    label="Waktu Kejadian"
                    name="waktuKecelakaan"
                    formik={formik}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup tag={Col} md="12">
              <Label className="form-label font-weight-bold">
                Lokasi Kecelakaan Kerja
              </Label>
              <Input
                id="userUPN"
                type="text"
                placeholder="Document Number"
                // value={selectedName?.userPrincipalName}
                defaultValue={""}
                formik={formik}
                onChange={formik.handleChange("lokasiKecelakaan")}
              />
              {formik.errors.userPrincipalName && (
                <div className="text-danger">{formik.errors.userPrincipalName}</div>
              )}
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup tag={Col} md="12">
              <FormikInput
                type="textarea"
                label="Incident yang Dialami"
                name="insidenYangDialami"
                formik={formik}
                placeholder=""
                height="114px"
                isRequired
              />
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddNewReport;
