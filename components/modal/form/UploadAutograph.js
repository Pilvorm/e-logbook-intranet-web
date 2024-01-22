import {
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";
import { HTTP_CODE } from "constant";
import { Formik } from "formik";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  Button,
  Form,
  FormGroup,
  CustomInput,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { editAllowance } from "redux/actions/master/allowance";
import { uploadSingleFiles } from "helpers/shared";
import * as yup from "yup";

const validationSchema = yup
  .object({
    file: yup.mixed().required("Must be filled"),
  })
  .required();

const UploadAutograph = ({ visible, toggle, data, ...props }) => {
  const { sessionData, uploadedAutograph } = props;
  const router = useRouter();
  const dispatch = useDispatch();

  const [previewModal, setPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [fileName, setFileName] = useState("");

  const onSubmit = async (values, actions) => {
    const { file, fileName } = values;

    let role = "";
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
    } catch (e) {
      console.error(e);
      role = "";
    }

    const formData = new FormData();
    formData.append("file", values.file);

    console.log(formData);

    try {
      const response = await uploadSingleFiles(
        role,
        upn,
        name,
        email,
        formData
      );

      if (response.status >= 200 || response.status <= 302) {
        actions.setSubmitting(false);
        successAlertNotification("Success", "Data saved succesfully");
        router.push({
          pathname: router.pathname,
        });
      } else {
        actions.setSubmitting(false);
        errorAlertNotification(
          "Error",
          "Something went wrong, please try again later."
        );
      }
    } catch (error) {
      errorAlertNotification(
        "Error",
        error?.response || "Something went wrong, please try again later."
      );
      console.error("File upload failed:", error);
    }
  };

  return (
    <Modal isOpen={visible} toggle={toggle}>
      <ModalHeader className="text-secondary bg-light" toggle={toggle}>
        Upload Autograph
      </ModalHeader>
      <Formik
        initialValues={{
          file: "",
          fileName: uploadedAutograph ?? "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
          handleChange,
          isSubmitting,
        }) => (
          <>
            <ModalBody>
              <form>
                <FormGroup>
                  <Label for="custom-file">Choose File</Label>
                  <CustomInput
                    type="file"
                    accept="image/*"
                    id="custom-file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFieldValue("file", e.target.files[0]);
                        setFieldValue("fileName", e.target.files[0].name);
                      } else {
                        setFieldValue("file", null);
                        setFieldValue("fileName", "");
                      }
                    }}
                    invalid={errors.file && touched.file}
                  />
                  {errors.file && touched.file && (
                    <div className="text-danger">
                      <small>{errors.file}</small>
                    </div>
                  )}
                </FormGroup>
                {values.file && (
                  <div className="d-flex justify-content-center my-2">
                    <img
                      alt="Autograph"
                      src={URL.createObjectURL(values.file)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                )}
                <FormGroup>
                  <Label for="fileName">File Name</Label>
                  <Input
                    type="text"
                    id="fileName"
                    value={values.fileName}
                    disabled
                  />
                </FormGroup>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                id="saveBtn"
                name="submitBtn"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span className="ml-50">Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default UploadAutograph;
