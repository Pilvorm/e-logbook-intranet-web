import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import { FieldArray, FormikProvider } from "formik";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

const JenisLain = ({ formik, jenisPeralatan }) => {
  return (
    <FormikProvider value={formik}>
      <FieldArray
        name="inventoryDetailJenis"
        render={(arrayHelpers) => {
          return (
            <div className="p-2" style={{ width: "100%" }}>
              {!(
                formik.values.status.includes("approval") ||
                formik.values.status.includes("Approved") ||
                formik.values.status.includes("Rejected")
              ) && (
                <Button.Ripple
                  type="button"
                  color="primary"
                  onClick={() => arrayHelpers.push({ jenis: "", jumlah: "" })}
                >
                  <Plus size={18} />
                  <span className="align-middle ml-1 d-sm-inline-block d-none">
                    Jenis {jenisPeralatan}
                  </span>
                </Button.Ripple>
              )}
              <Table responsive className="border mt-2">
                <thead>
                  <tr>
                    {!(
                      formik.values.status.includes("approval") ||
                      formik.values.status.includes("Approved") ||
                      formik.values.status.includes("Rejected")
                    ) && <th className="text-center">Action</th>}
                    <th className="text-center">No</th>
                    <th className="text-center">Jenis</th>
                    <th className="text-center">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {formik.values.inventoryDetailJenis.map((item, index) => {
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
                            formik={formik}
                            name={`inventoryDetailJenis[${index}].jenis`}
                            isArrayOfObject={true}
                            mainField="inventoryDetailJenis"
                            index={index}
                            keyObject="jenis"
                            disabled={
                              formik.values.status.includes("approval") ||
                              formik.values.status.includes("Approved") ||
                              formik.values.status.includes("Rejected")
                                ? true
                                : false
                            }
                          />
                          {/* <Input
                            name={`inventoryDetailJenis[${index}].jenis`}
                            onChange={formik.handleChange}
                            value={item.jenis}
                            invalid={
                              formik.errors.inventoryDetailJenis &&
                              formik.touched.inventoryDetailJenis &&
                              formik.errors.inventoryDetailJenis[index]?.jenis
                            }
                          />
                          {formik.errors.inventoryDetailJenis &&
                          formik.touched.inventoryDetailJenis &&
                          formik.errors.inventoryDetailJenis[index]?.jenis ? (
                            <div className="text-danger">
                              {formik.errors.inventoryDetailJenis[index]?.jenis}
                            </div>
                          ) : null} */}
                        </td>
                        <td className="text-center">
                          <SelfCustomInput
                            type="number"
                            formik={formik}
                            name={`inventoryDetailJenis[${index}].jumlah`}
                            isArrayOfObject={true}
                            mainField="inventoryDetailJenis"
                            index={index}
                            keyObject="jumlah"
                            disabled={
                              formik.values.status.includes("approval") ||
                              formik.values.status.includes("Approved") ||
                              formik.values.status.includes("Rejected")
                                ? true
                                : false
                            }
                          />
                          {/* <Input
                            name={`inventoryDetailJenis[${index}].jumlah`}
                            onChange={formik.handleChange}
                            value={item.jumlah}
                            type="number"
                            invalid={
                              formik.errors.inventoryDetailJenis &&
                              formik.touched.inventoryDetailJenis &&
                              formik.errors.inventoryDetailJenis[index]?.jumlah
                            }
                          />
                          {formik.errors.inventoryDetailJenis &&
                          formik.touched.inventoryDetailJenis &&
                          formik.errors.inventoryDetailJenis[index]?.jumlah ? (
                            <div className="text-danger">
                              {
                                formik.errors.inventoryDetailJenis[index]
                                  ?.jumlah
                              }
                            </div>
                          ) : null} */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {formik.touched.inventoryDetailJenis &&
              formik.errors.inventoryDetailJenis ? (
                <div className="text-danger">Harus diisi</div>
              ) : null}
            </div>
          );
        }}
      />
    </FormikProvider>
  );
};

export default JenisLain;
