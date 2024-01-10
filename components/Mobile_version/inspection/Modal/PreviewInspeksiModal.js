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

const PreviewInspeksiModal = ({
  openModal,
  openModalHandler,
  preview,
  imageName,
  EditHandler,
  isCAPA,
  viewOnly,
}) => {
  return (
    <Modal
      isOpen={openModal}
      backdrop={"static"}
      size="xl"
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
        <div className="w-100 d-flex justify-content-center">
          <img
            alt={`image`}
            src={preview}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
        <p className="text-center font-weight-bold">{imageName}</p>
      </ModalBody>
      <ModalFooter>
        {!viewOnly && (
          <Button color="secondary" onClick={() => EditHandler()}>
            Edit
          </Button>
        )}
        <Button color="danger" outline onClick={() => openModalHandler()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PreviewInspeksiModal;
