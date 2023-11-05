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

const FileModal = ({
  openModal,
  openModalHandler,
  preview,
  nomorPeralatan,
}) => {
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
        Preview
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          <div className="w-100 d-flex justify-content-center">
            <img alt={`image`} src={preview} width={200} height={200} />
          </div>
          <p>{nomorPeralatan}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" outline onClick={() => openModalHandler()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FileModal;
