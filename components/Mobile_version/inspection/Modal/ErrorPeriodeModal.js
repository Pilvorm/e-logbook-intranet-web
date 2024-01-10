import { useRouter } from "next/router";
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

const ErrorPeriodeModal = ({ text }) => {
  const router = useRouter();
  return (
    <Modal isOpen={true} backdrop={"static"} size="sm" centered={true}>
      <ModalHeader className="modalHeaderTextRejectPopUp bg-danger">
        Error
      </ModalHeader>
      <ModalBody>
        <div className="w-100 d-flex justify-content-start">{text}</div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => router.back()}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorPeriodeModal;
