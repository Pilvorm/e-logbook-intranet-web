import ImagePreviewModal from "components/kecelakaanKerja/ImagePreviewModal";
import { errorAlertNotification } from "components/notification";
import FileSaver from "file-saver";
import { FieldArray, useFormik } from "formik";
import { fetchImage, uploadSingleFiles } from "helpers/shared";
import { useState } from "react";
import {
  Download,
  Eye,
  MoreVertical,
  Plus,
  Trash,
  Upload,
} from "react-feather";
import {
  Button,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import * as yup from "yup";

export default function Lampiran({ name = "lampiran", formik, ...props }) {
  const [fileUploadPopUp, setFileUploadPopUp] = useState(false);

  const [previewModal, setPreviewModal] = useState(false);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetchImage(fileId);
      return FileSaver.saveAs(response, fileName);
    } catch (error) {
      console.log(error);
      errorAlertNotification("Error", "Failed to download file");
    }
  };

  const showError = !!formik.touched[name] && !!formik.errors[name];

  return (
    <div>
      <div className="" style={{ width: "100%" }}>
        <FieldArray name={name}>
          {(arrayHelpers) => (
            <>
              <Button.Ripple
                color="primary"
                id="buttonLampiran"
                className="btn-next mr-1"
                onClick={() => setFileUploadPopUp(true)}
                disabled={props.disabledForm}
              >
                <Plus size={18} />
                <span className="align-middle ml-1 d-sm-inline-block d-none">
                  Lampiran
                </span>
              </Button.Ripple>

              <div className="mt-2">
                <Table responsive className="border">
                  <thead className="text-center">
                    <tr>
                      <th className="text-center">Action</th>
                      <th className="text-center">No</th>
                      <th className="text-center">Keterangan</th>
                      <th className="text-center">Nama File</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {formik.values[name]?.map((file, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <UncontrolledDropdown
                              data-test-id={`option-select-lampiran-${index}`}
                              className="position-static"
                            >
                              <DropdownToggle
                                className="icon-btn hide-arrow"
                                id="optionsSelect"
                                color="transparent"
                                size="sm"
                                caret
                              >
                                <MoreVertical size={15} />
                              </DropdownToggle>
                              <DropdownMenu className="position-absolute">
                                {!props.disabledForm && !file._allowDelete && (
                                  <DropdownItem
                                    className="w-100"
                                    onClick={() => {
                                      setSelectedRowIndex(index);
                                      setFileUploadPopUp(true);
                                    }}
                                    id="uploadBtn"
                                  >
                                    <Upload className="mr-50" size={15} />
                                    <span className="align-middle">Upload</span>
                                  </DropdownItem>
                                )}
                                {file.idFile && (
                                  <>
                                    <DropdownItem
                                      className="w-100"
                                      onClick={() =>
                                        handleDownload(
                                          file.idFile,
                                          file.fileName
                                        )
                                      }
                                      id="downloadBtn"
                                    >
                                      <Download className="mr-50" size={15} />
                                      <span className="align-middle">
                                        Download
                                      </span>
                                    </DropdownItem>
                                    <DropdownItem
                                      className="w-100"
                                      onClick={() => {
                                        setSelectedRowIndex(index);
                                        setPreviewModal(true);
                                      }}
                                      id="viewBtn"
                                    >
                                      <Eye className="mr-50" size={15} />
                                      <span className="align-middle">View</span>
                                    </DropdownItem>
                                  </>
                                )}
                                {!props.disabledForm && file._allowDelete && (
                                  <DropdownItem
                                    className="w-100"
                                    onClick={() => arrayHelpers.remove(index)}
                                    id="deleteBtn"
                                  >
                                    <Trash className="mr-50" size={15} />
                                    <span className="align-middle">Delete</span>
                                  </DropdownItem>
                                )}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            {file?.keterangan}{" "}
                            {file._isRequired && (
                              <span className="text-danger">*</span>
                            )}
                          </td>
                          <td>
                            {showError &&
                            formik.errors[name]?.[index]?.idFile ? (
                              <FormFeedback className="d-block">
                                {formik.errors[name]?.[index]?.idFile}
                              </FormFeedback>
                            ) : (
                              file?.namaFile
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {fileUploadPopUp && ( // Adding conditionals to trigger notes changed in FileUploadModalWithNotes
                <FileUploadModalWithNotes
                  show={fileUploadPopUp}
                  onHide={() => {
                    setFileUploadPopUp(false);
                    setSelectedRowIndex(null);
                  }}
                  onFileUpload={(idFile, notes, fileName) => {
                    if (selectedRowIndex === null) {
                      // user add new row
                      return arrayHelpers.push({
                        idFile: idFile,
                        keterangan: notes,
                        namaFile: fileName,
                        _allowDelete: true,
                      });
                    }

                    arrayHelpers.replace(selectedRowIndex, {
                      ...formik.values[name][selectedRowIndex],
                      idFile: idFile,
                      keterangan: notes,
                      namaFile: fileName,
                    });

                    formik.setFieldTouched(name, false);
                  }}
                  notes={{
                    defaultValue:
                      formik.values[name][selectedRowIndex]?.keterangan || "",
                    disabled: selectedRowIndex !== null, // disable notes input if user click upload button
                  }}
                />
              )}

              {previewModal && (
                <ImagePreviewModal
                  isOpen={previewModal}
                  toggle={() => setPreviewModal(!previewModal)}
                  fileId={formik.values[name][selectedRowIndex]?.idFile}
                />
              )}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  );
}

function FileUploadModalWithNotes({
  show,
  onHide: onModalHide,
  onFileUpload,
  notes,
}) {
  const formId = "file-popup-notes-modal-form";
  const formik = useFormik({
    initialValues: {
      file: null,
      fileName: "",
      notes: notes?.defaultValue || "",
    },
    validationSchema: yup.object({
      file: yup.mixed().required("Harus diisi"),
      notes: yup.string().required("Harus diisi"),
    }),
    onSubmit: async (values) => {
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file);

        try {
          const response = await uploadSingleFiles(formData, "KecelakaanKerja");

          if (response.status >= 200 || response.status <= 302) {
            onFileUpload(
              response?.data?.id,
              values.notes,
              response?.data?.fileName
            );
          } else {
            errorAlertNotification("Error", "Something went wrong");
          }
        } catch (error) {
          errorAlertNotification(
            "Error",
            error?.response || "Something went wrong"
          );
          console.error("File upload failed:", error);
        }

        formik.resetForm();
        onHide();
      }
    },
  });

  const handleFileChange = (ev) => {
    if (ev.target.files[0]) {
      formik.setFieldValue("file", ev.target.files[0]);
      formik.setFieldValue("fileName", ev.target.files[0].name);
    } else {
      formik.setFieldValue("file", null);
      formik.setFieldValue("fileName", "");
    }
  };

  const onHide = () => {
    formik.resetForm();
    onModalHide();
  };

  return (
    <Modal isOpen={show} toggle={onHide}>
      <ModalHeader toggle={onHide}>Upload File</ModalHeader>
      <ModalBody>
        <Form id={formId} onSubmit={formik.handleSubmit}>
          <FormGroup>
            <Label for="custom-file">Choose File</Label>
            <CustomInput
              type="file"
              id="custom-file"
              onChange={handleFileChange}
              invalid={formik.errors.file && formik.touched.file}
            />
            {formik.errors.file && formik.touched.file && (
              <FormFeedback className="d-block">
                {formik.errors.file}
              </FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="text"
              id="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              invalid={formik.errors.notes && formik.touched.notes}
              disabled={notes?.disabled}
            />
            <FormFeedback>{formik.errors.notes}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="fileName">File Name</Label>
            <Input
              type="text"
              id="fileName"
              value={formik.values.fileName}
              disabled
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        {formik.isSubmitting ? (
          <Spinner size="sm" color="light" />
        ) : (
          <>
            <Button color="danger" onClick={onHide}>
              Close
            </Button>
            <Button
              form={formId}
              color="primary"
              type="submit"
              data-test-id="file-upload-submit-button"
            >
              Upload
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
