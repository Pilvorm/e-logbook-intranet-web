import React from "react";
import { Button, Input, Table } from "reactstrap";
import { Plus, Trash } from "react-feather";
import { Paper } from "@mui/material";
import { FieldArray, FormikProvider } from "formik";
import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";

const ParameterData = ({ formik }) => {
  return (
    <div className="mt-5">
      <h6 style={{ fontWeight: 800, color: "black", fontSize: 16 }}>
        Parameter
      </h6>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          {/* TODO: Functionality add and delete table row */}

          <FormikProvider value={formik}>
            <FieldArray
              name="inventoryDetailParameter"
              render={(arrayHelpers) => {
                return (
                  <>
                    {!(
                      formik.values.status.includes("approval") ||
                      formik.values.status.includes("Approved") ||
                      formik.values.status.includes("Rejected")
                    ) && (
                      <Button.Ripple
                        type="button"
                        color="primary"
                        onClick={() =>
                          arrayHelpers.push({ nama: "", keterangan: "" })
                        }
                      >
                        <Plus size={18} />
                        <span className="align-middle ml-1 d-sm-inline-block d-none">
                          Tambah Parameter
                        </span>
                      </Button.Ripple>
                    )}
                    <Table responsive bordered className="border mt-2">
                      <thead>
                        <tr>
                          {!(
                            formik.values.status.includes("approval") ||
                            formik.values.status.includes("Approved") ||
                            formik.values.status.includes("Rejected")
                          ) && <th className="text-center">Action</th>}
                          <th className="text-center">No</th>
                          <th className="text-center">Nama</th>
                          <th className="text-center">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.inventoryDetailParameter.map(
                          (item, index) => {
                            return (
                              <tr>
                                {!(
                                  formik.values.status.includes("approval") ||
                                  formik.values.status.includes("Approved") ||
                                  formik.values.status.includes("Rejected")
                                ) && (
                                  <td className="text-center">
                                    <Trash
                                      onClick={() => arrayHelpers.remove(index)}
                                      cursor="pointer"
                                      color="red"
                                    />
                                  </td>
                                )}
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  <SelfCustomInput
                                    id="nama"
                                    formik={formik}
                                    name={`inventoryDetailParameter[${index}].nama`}
                                    isArrayOfObject={true}
                                    mainField="inventoryDetailParameter"
                                    index={index}
                                    keyObject="nama"
                                    disabled={
                                      formik.values.status.includes(
                                        "approval"
                                      ) ||
                                      formik.values.status.includes("Approved")
                                        ? true
                                        : false
                                    }
                                  />
                                  {/* <Input
                                    name={`inventoryDetailParameter[${index}].nama`}
                                    onChange={formik.handleChange}
                                    value={item.nama}
                                    invalid={
                                      formik.errors.inventoryDetailParameter &&
                                      formik.touched.inventoryDetailParameter &&
                                      formik.errors.inventoryDetailParameter[
                                        index
                                      ]?.nama
                                    }
                                  />
                                  {formik.errors.inventoryDetailParameter &&
                                  formik.touched.inventoryDetailParameter &&
                                  formik.errors.inventoryDetailParameter[index]
                                    ?.nama ? (
                                    <div className="text-danger">
                                      {
                                        formik.errors.inventoryDetailParameter[
                                          index
                                        ]?.nama
                                      }
                                    </div>
                                  ) : null} */}
                                </td>
                                <td className="text-center">
                                  <SelfCustomInput
                                    id="keterangan"
                                    formik={formik}
                                    name={`inventoryDetailParameter[${index}].keterangan`}
                                    isArrayOfObject={true}
                                    mainField="inventoryDetailParameter"
                                    index={index}
                                    keyObject="keterangan"
                                    disabled={
                                      formik.values.status.includes(
                                        "approval"
                                      ) ||
                                      formik.values.status.includes("Approved")
                                        ? true
                                        : false
                                    }
                                  />
                                  {/* <Input
                                    name={`inventoryDetailParameter[${index}].keterangan`}
                                    onChange={formik.handleChange}
                                    value={item.keterangan}
                                    invalid={
                                      formik.errors.inventoryDetailParameter &&
                                      formik.touched.inventoryDetailParameter &&
                                      formik.errors.inventoryDetailParameter[
                                        index
                                      ]?.keterangan
                                    }
                                  />
                                  {formik.errors.inventoryDetailParameter &&
                                  formik.touched.inventoryDetailParameter &&
                                  formik.errors.inventoryDetailParameter[index]
                                    ?.keterangan ? (
                                    <div className="text-danger">
                                      {
                                        formik.errors.inventoryDetailParameter[
                                          index
                                        ]?.keterangan
                                      }
                                    </div>
                                  ) : null} */}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </Table>
                    {formik.errors.inventoryDetailParameter &&
                    formik.touched.inventoryDetailParameter ? (
                      <div className="text-danger">{"Harus diisi"}</div>
                    ) : null}
                  </>
                );
              }}
            />
          </FormikProvider>
        </div>
      </Paper>
    </div>
  );
};

export default ParameterData;
