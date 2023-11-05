import React from "react";
import { Button, Input, Table } from "reactstrap";
import { Plus, Trash } from "react-feather";
import { Paper } from "@mui/material";
import { FieldArray, FormikProvider } from "formik";

const NonKaryawanData = ({ formik }) => {
  return (
    <div>
      <Paper>
        <div className="mt-5 p-2" style={{ width: "100%" }}>
          {/* TODO: Functionality add and delete table row */}

          <FormikProvider value={formik}>
            <FieldArray
              name="dataNonKaryawan"
              render={(arrayHelpers) => {
                return (
                  <>
                    <Button.Ripple
                      type="button"
                      color="primary"
                      onClick={() =>
                        arrayHelpers.push({
                          nama: "",
                          perusahaan: "",
                        })
                      }
                    >
                      <Plus size={18} />
                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                        Tambah Non-Karyawan
                      </span>
                    </Button.Ripple>
                    <Table responsive bordered className="border mt-2">
                      <thead>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">No</th>
                          <th className="text-center">Nama</th>
                          <th className="text-center">Perusahaan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.dataNonKaryawan?.map((item, index) => {
                          return (
                            <tr>
                              <td className="text-center">
                                <Trash
                                  onClick={() => arrayHelpers.remove(index)}
                                  cursor="pointer"
                                  color="red"
                                />
                              </td>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                <Input
                                  name={`dataNonKaryawan[${index}].nama`}
                                  onChange={formik.handleChange}
                                  value={item.nama}
                                />
                                {formik.errors.dataNonKaryawan &&
                                formik.touched.dataNonKaryawan &&
                                formik.errors.dataNonKaryawan[index]?.nama ? (
                                  <div className="text-danger">
                                    {formik.errors.dataNonKaryawan[index]?.nama}
                                  </div>
                                ) : null}
                              </td>
                              <td className="text-center">
                                <Input
                                  name={`dataNonKaryawan[${index}].perusahaan`}
                                  onChange={formik.handleChange}
                                  value={item.perusahaan}
                                />
                                {formik.errors.dataNonKaryawan &&
                                formik.touched.dataNonKaryawan &&
                                formik.errors.dataNonKaryawan[index]
                                  ?.perusahaan ? (
                                  <div className="text-danger">
                                    {
                                      formik.errors.dataNonKaryawan[index]
                                        ?.perusahaan
                                    }
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
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

export default NonKaryawanData;
