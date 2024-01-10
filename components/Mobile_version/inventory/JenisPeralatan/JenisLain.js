import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import { FieldArray, FormikProvider } from "formik";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

const JenisLain = ({ formik, jenisPeralatan, viewOnly }) => {
  return (
    <FormikProvider value={formik}>
      <FieldArray
        name="updateInventoryDetailJenis"
        render={(arrayHelpers) => {
          return (
            <div className="p-2" style={{ width: "100%" }}>
              {!viewOnly && (
                <Button.Ripple
                  type="button"
                  color="primary"
                  onClick={() =>
                    arrayHelpers.push({
                      jenis: "",
                      jumlah: "",
                      inventoryHeaderId: formik.values.inventoryHeaderId,
                    })
                  }
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
                    {!viewOnly && <th className="text-center">Action</th>}
                    <th className="text-center">No</th>
                    <th className="text-center">Jenis</th>
                    <th className="text-center">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {formik.values.updateInventoryDetailJenis.map(
                    (item, index) => {
                      return (
                        <tr>
                          {!viewOnly && (
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
                              style={{ width: "200px" }}
                              formik={formik}
                              name={`updateInventoryDetailJenis[${index}].jenis`}
                              isArrayOfObject={true}
                              mainField="updateInventoryDetailJenis"
                              index={index}
                              keyObject="jenis"
                              disabled={viewOnly}
                            />
                          </td>
                          <td className="text-center">
                            <SelfCustomInput
                              type="number"
                              formik={formik}
                              name={`updateInventoryDetailJenis[${index}].jumlah`}
                              isArrayOfObject={true}
                              mainField="updateInventoryDetailJenis"
                              index={index}
                              keyObject="jumlah"
                              disabled={viewOnly}
                            />
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </Table>
              {formik.touched.updateInventoryDetailJenis &&
              formik.errors.updateInventoryDetailJenis ? (
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
