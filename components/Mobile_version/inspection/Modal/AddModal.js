import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";

const ParameterModal = ({ isOpen, toggle, addParameter }) => {
  const [parameter, setParameter] = useState("");

  const handleAddParameter = () => {
    if (parameter) {
      addParameter(parameter);
      setParameter("");
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Add Parameter</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Enter parameter"
          value={parameter}
          onChange={(e) => setParameter(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddParameter}>
          Add
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ParameterModal;
