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
import { useState } from "react";

const EducationHistoryPopup = ({ visible, toggle, data }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [visibility, setVisible] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <Modal isOpen={visible} className="modal-xl" toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        <div className="d-flex mt-2">
          <Users />
          <h3 className="ml-1">
            <strong>Education History</strong>
          </h3>
        </div>
      </ModalHeader>

      <>
        <ModalBody>
          <Table responsive className="border">
            <thead>
              <tr>
                <th className="text-left">NO</th>
                <th className="text-left">TK. PENDIDIKAN</th>
                <th className="text-left">NAMA INSTANSI</th>
                <th className="text-left">JURUSAN</th>
                <th className="text-left">KOTA</th>
                <th className="text-left">THN MULAI</th>
                <th className="text-left">THN SELESAI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((singleData, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{singleData?.educationLevel ?? "No"}</td>
                    <td>{singleData?.educationName ?? ""}</td>
                    <td>{singleData?.major ?? ""}</td>
                    <td>{singleData?.city ?? ""}</td>
                    <td>{singleData?.yearStart ?? ""}</td>
                    <td>{singleData?.yearEnd ?? ""}</td>
                  </tr>
                );
              })}
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

export default EducationHistoryPopup;
