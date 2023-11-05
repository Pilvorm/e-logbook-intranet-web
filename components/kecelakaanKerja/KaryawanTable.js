import { Paper } from "@mui/material";
import KaryawanPopUp from "components/modal/KaryawanPopUp";
import { FieldArray } from "formik";
import { useState } from "react";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

const KaryawanTable = ({ name = "dataKaryawan", formik }) => {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible(!visible);

  return (
    <div>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          {/* TODO: Functionality add and delete table row */}

          <FieldArray
            name={name}
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
                      Data Korban (Karyawan)
                    </span>
                  </Button.Ripple>
                  <KaryawanPopUp
                    visible={visible}
                    toggle={toggle}
                    values={formik.values[name]}
                    onChecked={(checked, row) => {
                      if (checked) {
                        arrayHelpers.push({
                          nik: row.nik,
                          nama: row.name,
                          dept: row.companyName,
                          jenisKelamin: row.gender || "undefined",
                          jabatan: row.jabatan,
                          upn: row.userPrincipalName || "-",
                          email: row.email,
                        });
                      } else {
                        const idx = formik.values[name].findIndex(
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
                      {formik.values[name]?.map((item, index) => {
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
                                name={`${name}[${index}].nik`}
                                onChange={formik.handleChange}
                                value={item.nik}
                              />
                              {formik.errors[name] &&
                              formik.touched[name] &&
                              formik.errors[name][index]?.nik ? (
                                <div className="text-danger">
                                  {formik.errors[name][index]?.nik}
                                </div>
                              ) : null}
                            </td>
                            <td className="text-center">
                              <Input
                                name={`${name}[${index}].nama`}
                                onChange={formik.handleChange}
                                value={item.nama}
                              />
                              {formik.errors[name] &&
                              formik.touched[name] &&
                              formik.errors[name][index]?.nama ? (
                                <div className="text-danger">
                                  {formik.errors[name][index]?.nama}
                                </div>
                              ) : null}
                            </td>
                            <td className="text-center">
                              <Input
                                name={`${name}[${index}].dept`}
                                onChange={formik.handleChange}
                                value={item.dept}
                              />
                              {formik.errors[name] &&
                              formik.touched[name] &&
                              formik.errors[name][index]?.dept ? (
                                <div className="text-danger">
                                  {formik.errors[name][index]?.dept}
                                </div>
                              ) : null}
                            </td>
                            <td className="text-center">
                              <Input
                                name={`${name}[${index}].jabatan`}
                                onChange={formik.handleChange}
                                value={item.jabatan}
                              />
                              {formik.errors[name] &&
                              formik.touched[name] &&
                              formik.errors[name][index]?.jabatan ? (
                                <div className="text-danger">
                                  {formik.errors[name][index]?.jabatan}
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
        </div>
      </Paper>
    </div>
  );
};

export default KaryawanTable;
