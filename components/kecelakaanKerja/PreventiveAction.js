import { Paper } from "@mui/material";
import FileUploadModal from "components/kecelakaanKerja/FileUploadModal";
import { FieldArray } from "formik";
import { useState } from "react";
import { Plus } from "react-feather";
import { Trash } from "react-feather";
import { PlusCircle } from "react-feather";
import { Button, Input, Table } from "reactstrap";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import PICCapaPopUp from "components/modal/PICCapaPopUp";

export default function PreventiveAction({
  name = "preventiveAction",
  formik,
}) {
  const [picCapaPopUp, setPicCapaPopUp] = useState(false);
  const togglePicCapaPopUp = () => setPicCapaPopUp(!picCapaPopUp);

  const [fileUploadPopUp, setFileUploadPopUp] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  return (
    <div>
      <Paper>
        <div className="p-2" style={{ width: "100%" }}>
          <FieldArray name={name}>
            {(arrayHelpers) => (
              <>
                <Button.Ripple
                  type="button"
                  color="primary"
                  onClick={() =>
                    arrayHelpers.push({
                      rekomendasi: "",
                      dueDate: new Date(),
                      picCapa: "",
                      dept: "",
                      fileId: "",
                      fileName: "",
                    })
                  }
                >
                  <Plus size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Corrective Action
                  </span>
                </Button.Ripple>
                <Table responsive bordered className="border mt-2">
                  <thead className="text-center">
                    <tr>
                      <th className="text-center">Action</th>
                      <th className="text-center">No</th>
                      <th className="text-center">Rekomendasi</th>
                      <th className="text-center">Due date</th>
                      <th className="text-center">PIC CAPA</th>
                      <th className="text-center">Dept</th>
                      <th className="text-center">Evidence</th>
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
                              name={`${name}[${index}].rekomendasi`}
                              onChange={formik.handleChange}
                              value={item.rekomendasi}
                            />
                          </td>
                          <td className="text-center">
                            <FormikDatePicker
                              name={`${name}[${index}].dueDate`}
                              onChange={formik.handleChange}
                              withFormGroup={false}
                              value={item.dueDate}
                            />
                          </td>
                          <td
                            className="text-center"
                            onClick={() => {
                              setSelectedRowIndex(index);
                              togglePicCapaPopUp();
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.picCapa || (
                              <PlusCircle size={18} cursor="pointer" />
                            )}
                          </td>
                          <td className="text-center">{item.dept}</td>
                          <td
                            className="text-center"
                            onClick={() => {
                              setSelectedRowIndex(index);
                              setFileUploadPopUp(true);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {item.fileId ? (
                              <>
                                <div>{item.fileId}</div>
                                <div>{item.fileName}</div>
                              </>
                            ) : (
                              <PlusCircle size={18} cursor="pointer" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <PICCapaPopUp
                  visible={picCapaPopUp}
                  toggle={togglePicCapaPopUp}
                  onAdd={(row) => {
                    formik.setFieldValue(
                      `${name}[${selectedRowIndex}].picCapa`,
                      row.name
                    );
                    formik.setFieldValue(
                      `${name}[${selectedRowIndex}].dept`,
                      row.companyName
                    );
                  }}
                />

                <FileUploadModal
                  show={fileUploadPopUp}
                  onHide={() => setFileUploadPopUp(false)}
                  onFileUpload={(idFile, notes, fileName) => {
                    formik.setFieldValue(
                      `${name}[${selectedRowIndex}].fileId`,
                      idFile
                    );
                    formik.setFieldValue(
                      `${name}[${selectedRowIndex}].fileName`,
                      fileName
                    );
                    setFileUploadPopUp(false);
                  }}
                />
              </>
            )}
          </FieldArray>
        </div>
      </Paper>
    </div>
  );
}
