import SelfCustomInput from "components/CustomFieldsFormik/CustomInput";
import { FieldArray, FormikProvider } from "formik";
import { Plus, Trash } from "react-feather";
import { Button, Input, Table } from "reactstrap";

const JenisLain = ({ data, jenisPeralatan }) => {
  return (
    <div className="mx-2">
      <Table responsive className="border mt-2">
        <thead>
          <tr>
            <th className="text-center">No</th>
            <th className="text-center">Jenis</th>
            <th className="text-center">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item.jenis}</td>
                <td className="text-center">{item.jumlah}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default JenisLain;
