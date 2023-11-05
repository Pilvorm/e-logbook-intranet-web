// import {
//   errorAlertNotification,
//   successAlertNotification,
// } from "components/notification";
// import { HTTP_CODE } from "constant";
// import { Formik } from "formik";
// import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Button,
//   FormGroup,
//   Input,
//   Label,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
//   Spinner,
// } from "reactstrap";
// //   import { createMasterAttachmentType } from "redux/actions/master/attachment-type";
// import * as yup from "yup";
// import { useSession } from "next-auth/react";
// import { getCurrentUserSite } from "redux/actions/auth";
// import { useEffect } from "react";

// const validationSchema = yup
//   .object({
//     attachmentType: yup
//       .string()
//       // .matches(/^[a-zA-Z0-9 ]*$/, "Special characters are not allowed")
//       .required("Attachment Type is required"),
//     siteName: yup.string().required("Site Name is required"),
//   })
//   .required();

// const CreateUserPopup = ({ visible, toggle }) => {
//   const { data: session, status } = useSession();

//   const router = useRouter();
//   const dispatch = useDispatch();

//   // getCurrentUserSite
// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       dispatch(getCurrentUserSite());
// //     }
// //   }, [dispatch]);

// //   const currentUserSite = useSelector((state) =>
// //     state.authReducers.currentUserSite !== ""
// //       ? JSON.parse(state.authReducers.currentUserSite)
// //       : ""
// //   );

// //   const onSubmit = (values, actions) => {
// //     const { attachmentType, siteName } = values;

// //     dispatch(
// //       createMasterAttachmentType({
// //         type: attachmentType,
// //         site: siteName,
// //       }),
// //       session.user.token
// //     ).then((res) => {
// //       if (res.status === HTTP_CODE.CREATED) {
// //         actions.setSubmitting(false);
// //         successAlertNotification("Success", "Data Created Successfully");
// //         router.push({
// //           pathname: router.pathname,
// //         });
// //       } else if (res.status === 409) {
// //         actions.setSubmitting(false);
// //         errorAlertNotification(
// //           "Duplicate",
// //           "Duplicate Data, Please check your data."
// //         );
// //       } else {
// //         actions.setSubmitting(false);
// //         console.error(res);
// //         let errorMessages = [];

// //         try {
// //           errorMessages = Object.entries(res.data.errors).flatMap(
// //             ([field, messages]) => {
// //               return messages.map((message) => ({ field, message }));
// //             }
// //           );
// //         } catch (error) {
// //           // Handle the error appropriately
// //           errorMessages = [
// //             {
// //               field: "Error",
// //               message: "Something went wrong, Please try again later.",
// //             },
// //           ];
// //         }

// //         const title = "Error";
// //         const message =
// //           errorMessages.length > 0
// //             ? errorMessages
// //                 .map(({ field, message }) => `${field}: ${message}`)
// //                 .join("\n")
// //             : "";

// //         errorAlertNotification(title, message);
// //       }
// //     });
// //   };

//   return (
//     <Modal isOpen={visible} toggle={toggle}>
//       <ModalHeader className="text-secondary bg-light" toggle={toggle}>
//         Add
//       </ModalHeader>
//       <Formik
//         enableReinitialize
//         initialValues={{
//           // attachmentType: "",
//           // // siteName: currentUserSite?.ClusterCode,
//           // siteName: currentUserSite?.CompanyName,
//         }}
//         // validationSchema={validationSchema}
//         // onSubmit={onSubmit}
//       >
//         {({
//           values,
//           errors,
//           setFieldValue,
//           handleSubmit,
//           handleChange,
//           isSubmitting,
//         }) => (
//           <>
//             <ModalBody>
//               <form>
//                 <FormGroup>
//                   <Label className="form-label">Nama</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     placeholder="Name"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>
//                 <FormGroup>
//                   <Label className="form-label">Username</Label>
//                   <Input
//                     id="username"
//                     type="text"
//                     placeholder="Username"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>

//                 <FormGroup>
//                   <Label className="form-label">Site</Label>
//                   <Input
//                     id="site"
//                     type="text"
//                     placeholder="Site"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>

//                 <FormGroup>
//                   <Label className="form-label">Departemen</Label>
//                   <Input
//                     id="department"
//                     type="text"
//                     placeholder="Department"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>

//                 <FormGroup>
//                   <Label className="form-label">Email</Label>
//                   <Input
//                     id="email"
//                     type="text"
//                     placeholder="Email"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>

//                 <FormGroup>
//                   <Label className="form-label">Role</Label>
//                   <Input
//                     id="Role"
//                     type="text"
//                     placeholder="Role"
//                     value={""}
//                     onChange={handleChange("attachmentType")}
//                     // disabled
//                   />
//                   {errors.attachmentType && (
//                     <div className="text-danger">
//                       <small>{""}</small>
//                     </div>
//                   )}
//                 </FormGroup>
//               </form>
//             </ModalBody>
//             <ModalFooter>
//               <Button
//                 color="success"
//                 id="submitBtn"
//                 name="submitBtn"
//                 onClick={handleSubmit}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Spinner size="sm" color="white" />
//                     <span className="ml-50">Submitting...</span>
//                   </>
//                 ) : (
//                   "Save"
//                 )}
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </Formik>
//     </Modal>
//   );
// };

// export default CreateUserPopup;
