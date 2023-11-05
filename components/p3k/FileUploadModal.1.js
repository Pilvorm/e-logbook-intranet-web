import { errorAlertNotification } from "components/notification";
import { uploadSingleFiles } from "helpers/shared";
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

export function FileUploadModal({ show, onHide, onFileUpload, push }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState(""); // New state for the fileName

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name); // Set the fileName when a file is selected
  };
  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // const response = await fetch("", {
        //   method: "POST",
        //   body: formData,
        // });
        const response = await uploadSingleFiles(formData, "P3K");

        console.log(response);

        if (response.status >= 200 || response.status <= 302) {
          onFileUpload(response?.data?.fileName, notes, response?.data?.id);
        } else {
          errorAlertNotification("Error", "Something went wrong");
        }
      } catch (error) {
        // Handle network or other errors
        errorAlertNotification(
          "Error",
          error?.response || "Something went wrong"
        );
        console.error("File upload failed:", error);
      }

      setSelectedFile(null);
      setNotes("");
      setFileName("");
      onHide();
    }
  };

  return (
    <Modal isOpen={show} toggle={onHide}>
      <ModalHeader toggle={onHide}>Upload File</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="custom-file">Choose File</Label>
            <Input type="file" id="custom-file" onChange={handleFileChange} />
          </FormGroup>
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="text"
              id="notes"
              placeholder="Enter notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="fileName">File Name</Label>
            <Input type="text" id="fileName" value={fileName} disabled />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onHide}>
          Close
        </Button>
        <Button color="primary" onClick={handleUpload}>
          Upload
        </Button>
      </ModalFooter>
    </Modal>
  );
}
