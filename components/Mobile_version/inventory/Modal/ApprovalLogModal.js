import { LoadingIndicator } from "components/shared";
import { getAllInventory } from "helpers/inventory";
import { errorNotification } from "helpers/utils";
import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useDispatch } from "react-redux";
import {
  Button,
  CustomInput,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { reauthenticate } from "redux/actions/auth";

const ApprovalLogModal = ({ openModal, openModalHandler, approvalLog }) => {
  return (
    <Modal
      isOpen={openModal}
      backdrop={"static"}
      size="md"
      centered={true}
      toggle={() => openModalHandler()}
    >
      <ModalHeader
        className="modalHeaderTextRejectPopUp bg-primary"
        style={{ backgroundColor: "#3B85F8" }}
        toggle={() => openModalHandler()}
      >
        Approval Log
      </ModalHeader>
      <ModalBody>
        <Table responsive className="border">
          <thead>
            <tr>
              <th className="w-5 text-left">No</th>
              <th className="text-left">Status</th>
              <th className="text-left">User</th>
              <th className="text-left">Message</th>
              <th className="text-left">Date</th>
              <th className="text-left">Lead Time</th>
            </tr>
          </thead>
          <tbody>
            {approvalLog.map((data, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{data.status}</td>
                  <td>{data.approverFromName}</td>
                  <td>{data.notes}</td>
                  <td>{data.createdDate}</td>
                  <td>{data.duration}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => openModalHandler()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ApprovalLogModal;
