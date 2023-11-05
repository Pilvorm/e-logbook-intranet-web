import { Paper } from "@mui/material";
import KaryawanPopUp from "components/modal/KaryawanPopUp";
import { FieldArray, FormikProvider } from "formik";
import { useState } from "react";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

const KaryawanData = ({ formik }) => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <div>
      <Paper>
        <div className="mt-5 p-2" style={{ width: "100%" }}>
          {/* TODO: Functionality add and delete table row */}

          <FormikProvider value={formik}>
            <FieldArray
              name="dataKaryawan"
              render={(arrayHelpers) => {
                return (
                  <>
                    <Button.Ripple
                      type="button"
                      color="primary"
                      onClick={() => setVisible(true)}
                    >
                      <Plus size={18} />
                      <span className="align-middle ml-1 d-sm-inline-block d-none">
                        Tambah Karyawan
                      </span>
                    </Button.Ripple>
                    <KaryawanPopUp
                      visible={visible}
                      toggle={toggle}
                      values={formik.values.dataKaryawan}
                      onChecked={(checked, row) => {
                        if (checked) {
                          arrayHelpers.push({
                            nik: row.nik,
                            nama: row.name,
                            dept: row.companyName,
                            jabatan: row.jabatan,
                          });
                        } else {
                          const idx = formik.values.dataKaryawan.findIndex(
                            (item) => item.nik === row.nik
                          );
                          arrayHelpers.remove(idx);
                        }
                      }}
                    />
                    <Table responsive bordered className="border mt-2">
                      <thead>
                        <tr>
                          <th className="text-center">Action</th>
                          <th className="text-center">No</th>
                          <th className="text-center">NIK</th>
                          <th className="text-center">Nama</th>
                          <th className="text-center">Dept</th>
                          <th className="text-center">Jabatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.dataKaryawan?.map((item, index) => {
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
                                  name={`dataKaryawan[${index}].nik`}
                                  onChange={formik.handleChange}
                                  value={item.nik}
                                />
                                {formik.errors.dataKaryawan &&
                                formik.touched.dataKaryawan &&
                                formik.errors.dataKaryawan[index]?.nik ? (
                                  <div className="text-danger">
                                    {formik.errors.dataKaryawan[index]?.nik}
                                  </div>
                                ) : null}
                              </td>
                              <td className="text-center">
                                <Input
                                  name={`dataKaryawan[${index}].nama`}
                                  onChange={formik.handleChange}
                                  value={item.nama}
                                />
                                {formik.errors.dataKaryawan &&
                                formik.touched.dataKaryawan &&
                                formik.errors.dataKaryawan[index]?.nama ? (
                                  <div className="text-danger">
                                    {formik.errors.dataKaryawan[index]?.nama}
                                  </div>
                                ) : null}
                              </td>
                              <td className="text-center">
                                <Input
                                  name={`dataKaryawan[${index}].dept`}
                                  onChange={formik.handleChange}
                                  value={item.dept}
                                />
                                {formik.errors.dataKaryawan &&
                                formik.touched.dataKaryawan &&
                                formik.errors.dataKaryawan[index]
                                  ?.dept ? (
                                  <div className="text-danger">
                                    {
                                      formik.errors.dataKaryawan[index]
                                        ?.dept
                                    }
                                  </div>
                                ) : null}
                              </td>
                              <td className="text-center">
                                <Input
                                  name={`dataKaryawan[${index}].jabatan`}
                                  onChange={formik.handleChange}
                                  value={item.jabatan}
                                />
                                {formik.errors.dataKaryawan &&
                                formik.touched.dataKaryawan &&
                                formik.errors.dataKaryawan[index]?.jabatan ? (
                                  <div className="text-danger">
                                    {formik.errors.dataKaryawan[index]?.jabatan}
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

export default KaryawanData;
