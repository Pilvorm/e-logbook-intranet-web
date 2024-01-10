import React, { Fragment } from "react";
import { Button, Input, Table } from "reactstrap";
import { Plus, Trash, Trash2 } from "react-feather";
import { Paper } from "@mui/material";
import { FieldArray, FormikProvider } from "formik";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";

const UpdateParameterInventory = ({ formik, viewOnly }) => {
  return (
    <div className="mt-5">
      <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
        Parameter
      </h6>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          <FormikProvider value={formik}>
            <FieldArray
              name={"updateInventoryDetailParameter"}
              render={(arrayHelpers) => {
                return (
                  <Fragment>
                    {!viewOnly && (
                      <Button.Ripple
                        type="button"
                        color="primary"
                        onClick={() =>
                          arrayHelpers.push({
                            nama: "",
                            keterangan: "",
                            inventoryHeaderId: formik.values.inventoryHeaderId,
                          })
                        }
                        className="mb-2"
                      >
                        <Plus size={18} />
                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                          Tambah Parameter
                        </span>
                      </Button.Ripple>
                    )}
                    {formik.values.updateInventoryDetailParameter.map(
                      (detail, index) => {
                        return (
                          <div className="">
                            {!viewOnly && (
                              <Trash2
                                color="red"
                                className="mr-1"
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            )}
                            <strong style={{ color: "green" }}>
                              {`Parameter Tambahan ${index + 1}`}
                            </strong>

                            <div className="mb-1 mt-1">
                              <SelfCustomInput
                                formik={formik}
                                label="Nama"
                                name={`updateInventoryDetailParameter[${index}].nama`}
                                isArrayOfObject={true}
                                mainField="updateInventoryDetailParameter"
                                index={index}
                                keyObject="nama"
                                disabled={viewOnly}
                              />
                            </div>
                            <div className="mb-1 mt-2">
                              <SelfCustomInput
                                formik={formik}
                                label="Keterangan"
                                name={`updateInventoryDetailParameter[${index}].keterangan`}
                                isArrayOfObject={true}
                                mainField="updateInventoryDetailParameter"
                                index={index}
                                keyObject="keterangan"
                                disabled={viewOnly}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </Fragment>
                );
              }}
            />
          </FormikProvider>
        </div>
      </Paper>
    </div>
  );
};

export default UpdateParameterInventory;
