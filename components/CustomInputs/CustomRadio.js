import { Field, useField } from "formik";
import React from "react";
import { CustomInput, FormFeedback, FormGroup, Input, Label } from "reactstrap";

const MyCustomRadio = ({
  label,
  name,
  options = [],
  isRow = false,
  ...props
}) => {
  return (
    <div className="col-12 m-0 p-0 row">
      <label
        className="w-100 font-weight-bold"
        style={{ fontSize: "12px" }}
        htmlFor={name}
      >
        {label}
      </label>
      <Field name={name}>
        {({ field, meta }) => {
          return (
            <React.Fragment>
              {options.map((option, index) => {
                return (
                  <React.Fragment
                    key={Math.floor(Math.random() * 100000).toString()}
                  >
                    <div
                      className={
                        isRow
                          ? `col-4 d-flex flex align-items-center mb-0 mt-0 w-100`
                          : `col-12 d-flex flex align-items-center mb-0 mt-0`
                      }
                    >
                      <input
                        type="radio"
                        id={option.key}
                        {...field}
                        style={{ height: 20, width: 20 }}
                        value={option.value}
                        checked={field.value === option.value}
                      />
                      <span className="d-flex w-full" style={{ marginLeft: 10 }} htmlFor={option.key}>
                        {option.value}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
              {meta.touched && meta.error != undefined && (
                <FormGroup className="m-0 p-0 col-12">
                  <Input invalid={meta.touched && meta.error} hidden />
                  <div style={{ paddingTop: 10 }}></div>
                  <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
              )}
            </React.Fragment>
          );
        }}
      </Field>
    </div>
  );
};
export default MyCustomRadio;
