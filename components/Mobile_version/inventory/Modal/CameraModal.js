import { errorNotification } from "helpers/utils";
import { useEffect, useRef, useState } from "react";
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

const CameraModal = ({ openModal, openModalHandler, handleSubmit }) => {
  const [previewOnModal, setPreviewOnModal] = useState(null);
  const [nama, setNama] = useState("");
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if the selected file is an image (you can add more image formats as needed)
      const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedFormats.includes(selectedFile.type)) {
        setFile(event.target.files[0]);
        // Generate preview for the selected file
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewOnModal(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        // ref.current.value = "";
        errorNotification("Error", "Tipe file harus gambar");
        setFile(null);
        setPreviewOnModal(null);
      }
    }
  };

  const SubmitFile = () => {
    if (nama.length == 0 || !file) {
      // console.log(ref, "NAMAAAAA");
      errorNotification("Error", "Field Gambar/Nama masih kosong");
    } else {
      setPreviewOnModal(null);
      setNama("");
      setFile("");
      handleSubmit(file, nama);
      openModalHandler();
    }
  };

  const ref = useRef(null);

  const resetAfterClose = () => {
    setPreviewOnModal(null);
    setNama("");
    setFile("");
    openModalHandler();
  };

  // useEffect(() => {
  //   ref.current.value = "";
  // }, [ref]);

  return (
    <Modal
      isOpen={openModal}
      backdrop={"static"}
      size="xl"
      centered={true}
      toggle={() => resetAfterClose()}
    >
      <ModalHeader
        className="modalHeaderTextRejectPopUp bg-primary"
        style={{ backgroundColor: "#3B85F8" }}
        toggle={() => resetAfterClose()}
      >
        Add File
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="comment" className="modalBodyLabelTextRejectPopUp">
            Nama
          </Label>
          <CustomInput
            className="form-control"
            type="text"
            id="nama"
            name="nama"
            onChange={(e) => setNama(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="comment" className="modalBodyLabelTextRejectPopUp">
            Upload
          </Label>
          <CustomInput
            type="file"
            id="exampleCustomFileBrowser"
            name="customFile"
            accept=".jpg, .jpeg, .png"
            label={"choose an image file"}
            // onChange={onSelectFile}
            onChange={(event) => handleFileChange(event)}
            // invalid={invalidFile}
            innerRef={ref}
          />
        </FormGroup>
        {previewOnModal ? (
          <div className="w-100 d-flex justify-content-center">
            <img alt={`image`} src={previewOnModal} width={200} height={150} />
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button
          id="submitFile"
          color="primary"
          onClick={() => {
            SubmitFile();
          }}
        >
          Submit
        </Button>
        <Button color="danger" outline onClick={() => resetAfterClose()}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CameraModal;
