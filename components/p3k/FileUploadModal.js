import {
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";
import { uploadSingleFiles } from "helpers/shared";
import React, { useState, useEffect } from "react";
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
  Spinner, // Added Spinner component for loading
} from "reactstrap";

function FileUploadModal({ show, onHide, onFileUpload, push }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setLoading(true); // Show loading indicator
        const response = await uploadSingleFiles(formData, "P3K");
        setLoading(false); // Hide loading indicator

        if (response.status >= 200 || response.status <= 302) {
          onFileUpload(response?.data?.id, notes, response?.data?.fileName);
          successAlertNotification("Success", "File Uploaded");
        } else {
          errorAlertNotification("Error", "Something went wrong");
        }
      } catch (error) {
        setLoading(false); // Hide loading indicator
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
        {loading ? (
          <Spinner size="sm" color="light" />
        ) : (
          <>
            <Button color="secondary" onClick={onHide}>
              Close
            </Button>
            <Button color="primary" onClick={handleUpload}>
              Upload
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default FileUploadModal;
