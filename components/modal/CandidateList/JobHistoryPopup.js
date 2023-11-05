import { HTTP_CODE } from "constant";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { Users } from "react-feather";
import { createMasterCity, editMasterCity } from "redux/actions/master/city";
import * as yup from "yup";

const JobHistoryPopup = ({
  visible,
  toggle,
  data,
  lastSalary,
  lastAllowance,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const HistoryJobDetail = ({ gajiTerakhir, tunjanganTerakhir }) => (
    <div className="row">
      <div className="col-sm">
        <div className=" d-flex flex-column my-2 ml-5">
          <p>Gaji Pokok terakhir yang diterima</p>
          <h4 className="font-weight-bold">
            <strong>{gajiTerakhir}</strong>
          </h4>
        </div>
      </div>

      <div className="col-sm">
        <div className=" d-flex flex-column my-2">
          <p>Tunjangan/Fasilitas terakhir yang diterima</p>
          <h4 className="font-weight-bold">
            <strong>{tunjanganTerakhir}</strong>
          </h4>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={visible} className="modal-lg" toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        <div className="d-flex mt-2">
          <Users />
          <h3 className="ml-1">
            <strong>Job History</strong>
          </h3>
        </div>
      </ModalHeader>

      <>
        <ModalBody>
          <div>
            <HistoryJobDetail
              gajiTerakhir={`Rp. ${lastSalary}` ?? ""}
              tunjanganTerakhir={lastAllowance ?? ""}
            />
          </div>
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="text-center align-middle">NO</th>
                <th className="text-center align-middle">NAMA PERUSAHAAN</th>
                <th className="text-center align-middle">JABATAN</th>
                <th className="text-center align-middle">
                  STATUS <br></br>PEKERJAAN
                </th>
                <th className="text-center align-middle">
                  TGL <br></br>MULAI BEKERJA
                </th>
                <th className="text-center align-middle">
                  TGL <br></br>SELESAI BEKERJA
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((singleData, index) => (
                  <>
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {singleData?.companyName ?? ""}
                      </td>
                      <td className="text-center">
                        {singleData?.posisition ?? ""}
                      </td>
                      <td className="text-center">
                        {singleData?.status ?? ""}
                      </td>
                      <td className="text-center">
                        {singleData?.yearStart ?? ""}
                      </td>
                      <td className="text-center">
                        {singleData?.yearEnd ?? ""}
                      </td>
                    </tr>{" "}
                  </>
                ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </>
    </Modal>
  );
};

export default JobHistoryPopup;
