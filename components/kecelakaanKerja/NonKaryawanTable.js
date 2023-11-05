import { Paper } from "@mui/material";
import { FieldArray } from "formik";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

export default function NonKaryawanTable({ name = "dataNonKaryawan", formik }) {
  return (
    <div>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          <FieldArray name={name}>
            {({ push, remove }) => (
              <>
                <Button.Ripple
                  type="button"
                  color="primary"
                  onClick={() =>
                    push({
                      nama: "",
                      perusahaan: "",
                      jenisKelamin: "",
                    })
                  }
                >
                  <Plus size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Data Korban (Non Karyawan)
                  </span>
                </Button.Ripple>

                <Table responsive bordered className="border mt-2">
                  <thead>
                    <tr>
                      <th className="text-center">Action</th>
                      <th className="text-center">No</th>
                      <th className="text-center">Nama</th>
                      <th className="text-center">Perusahaan</th>
                      <th className="text-center">Jenis Kelamin</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {formik.values[name].map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <Trash
                            onClick={() => remove(index)}
                            cursor="pointer"
                            color="red"
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td className="w-25">
                          <Input
                            type="text"
                            name={`${name}.${index}.nama`}
                            onChange={formik.handleChange}
                            value={item.nama}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            name={`${name}.${index}.perusahaan`}
                            onChange={formik.handleChange}
                            value={item.perusahaan}
                          />
                        </td>
                        <td>
                          <Input
                            type="text"
                            name={`${name}.${index}.jenisKelamin`}
                            onChange={formik.handleChange}
                            value={item.jenisKelamin}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </FieldArray>
        </div>
      </Paper>
    </div>
  );
}
