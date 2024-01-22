import { useState } from "react";
import {
  Button,
  CustomInput,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { getPermissionComponentByRoles } from "helpers/getPermission";

const StatusModal = ({ visible, toggle, status, pay }) => {
  return (
    <Modal
      isOpen={visible}
      toggle={toggle}
      backdrop={"static"}
      size="sm"
      centered={true}
    >
      <ModalHeader
        className="modalHeaderTextRejectPopUp bg-warning"
        // style={{ backgroundColor: "#3B85F8" }}
        toggle={toggle}
      >
        Status
      </ModalHeader>
      <ModalBody>
        <div className="w-100 py-1 d-flex flex-column justify-content-start">
          <div>
            <h5>Status</h5>
            <span>{status}</span>
          </div>
          {getPermissionComponentByRoles(["HR"]) && (
            <div className="mt-2">
              <h5>Pay</h5>
              <span>Rp {pay.toLocaleString("de-DE")}</span>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default StatusModal;
