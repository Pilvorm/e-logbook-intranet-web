import React, { useEffect, useState } from "react";
import { ListHeader } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { wrapper } from "redux/store";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Spinner,
  Table,
} from "reactstrap";
import {
  Check,
  Save,
  Play,
  Edit,
  XSquare,
  ArrowLeft,
  Printer,
  Eye,
  Download,
  ExternalLink,
} from "react-feather";
import { Paper } from "@mui/material";
import ModalFilter from "components/inspection/ModalFilter";
import DetaiDataInventory from "components/inspection/DetailDataInventory";
import { useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { getAllInventoryByID, SubmitData } from "redux/actions/inventory";
import { connect } from "react-redux";
import AddNewInventory from "components/inspection/AddNewInventory";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { uploadMultipleFiles } from "helpers/shared";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotificationWithFunction,
} from "components/notification";
import {
  getPermissionComponent,
  getPermissionComponentByRoles,
} from "helpers/getPermission";
import axios from "axios";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
const AddInventory = (props) => {
  const { query, id, sessionData, token } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState("1");
  const [pageSize, setPageSize] = useState("1");
  const [searchQuery, setSearchQuery] = useState("1");
  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [buttonState, setButtonState] = useState("Save");
  const pageSizeOptions = [5, 10, 25, 50];
  const toggle = (key) => setActive(key);

  const handlePageSize = () => {};
  const handleSearchQuery = () => {};

  // const dummyData = {
  //   nomorPeralatan: "0001/APR/DF",
  //   site: "PT Dankos Farma",
  //   type: "APAR",
  //   periodCheck: 12,
  // };

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const formik = useFormik({
    initialValues: {
      id: 0,
      createdBy: "",
      createdByName: "",
      updatedBy: "",
      updatedByName: "",
      isDeleted: false,
      nomorPeralatan: "",
      companyCode: "",
      companyName: sessionData?.user.CompName,
      kodeJenisPeralatan: "",
      jenisPeralatan: "",
      lokasi: "",
      area: "",
      periodePengecekan: 0,
      tanggalPengecekan: "",
      status: "",
      creatorEmail: "",
      creatorUpn: "",
      creatorName: "",
      superSuperiorName: "",
      superSuperiorUPN: "",
      superSuperiorEmail: "",
      inventoryDetailParameter: [],
      inventoryDetailGambar: [],
      inventoryDetailApar: [],
      inventoryDetailJenis: [],
    },
    validationSchema: yup.object().shape({
      jenisPeralatan: yup.string().required("Harus diisi"),
      lokasi: yup.string().required("Harus diisi"),
      area: yup.string().required("Harus diisi"),
      area: yup.string().required("Harus diisi"),
      periodePengecekan: yup.number().required("Harus diisi"),
      tanggalPengecekan: yup.date().required("Harus diisi"),
      inventoryDetailParameter: yup.array().of(
        yup.object().shape({
          nama: yup.string().required("Harus diisi"),
          keterangan: yup.string().required("Harus diisi"),
          // Rest of your amenities object properties
        })
      ),
      inventoryDetailApar: yup.array().when("jenisPeralatan", {
        is: "APAR",
        then: yup
          .array()
          .of(
            yup.object().shape({
              media: yup.string().required("Harus diisi"),
              merk: yup.string().required("Harus diisi"),
              kapasitas: yup.string().required("Harus diisi"),
              berat: yup.string().required("Harus diisi"),
              tanggalEdTabung: yup.date().required("Harus diisi"),
            })
          )
          .required("Harus diisi"),
        otherwise: yup.array(),
      }),
      inventoryDetailJenis: yup.array().when("jenisPeralatan", {
        is: (jenisPeralatan) => {
          return jenisPeralatan == "APD" || jenisPeralatan == "Spill Kit";
        },
        then: yup
          .array()
          .of(
            yup.object().shape({
              jenis: yup.string().required("Harus diisi"),
              jumlah: yup.string().required("Harus diisi"),
            })
          )
          .min(1)
          .required("Harus diisi"),
        otherwise: yup.array(),
      }),
    }),
    onSubmit: async (values) => {
      if (!imageError) {
        setSubmitLoading(true);
        try {
          const formData = new FormData();

          imageList.forEach((fileData, index) => {
            formData.append(`file${index + 1}`, fileData.file);
          });

          const response = await uploadMultipleFiles(formData, "Inventory");

          const dataFileTemp = response.data.map((fileData, index) => ({
            no: index + 1,
            nama: imageList[index].nama,
            fileId: fileData.id,
            fileName: fileData.fileName,
          }));

          const newData = {
            ...values,
            inventoryDetailGambar: dataFileTemp,
            tanggalPengecekan: moment(values.tanggalPengecekan).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            companyCode: sessionData?.user?.CompCode,
            companyName: sessionData?.user?.CompName,
            creatorEmail: sessionData?.user?.Email,
            creatorUpn: sessionData?.user?.UserPrincipalName,
            creatorName: sessionData?.user?.Name,
          };

          console.log(newData);

          if (buttonState === "Save") {
            await SaveHandler(newData);
          } else if (buttonState === "Submit") {
            await SubmitHandler(newData);
          }

          // Handle the newData or any further logic here

          setSubmitLoading(false);
        } catch (error) {
          // Handle any errors that occur during the file upload or other operations
          console.error("Error:", error);
          setSubmitLoading(false);
        }
      } else {
        setImageError(true);
      }
    },
  });

  const notificationHandler = (state) => {
    if (state == "Save") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin menyimpan data ini?`,
        () => {
          formik.submitForm();
        },
        () => {}
      );
    } else if (state == "Submit") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin submit data ini?`,
        () => {
          formik.submitForm();
        },
        () => {}
      );
    }
  };

  const SaveHandler = async (newData) => {
    let role = "";
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
      console.log(role, "ROLE");
    } catch (e) {
      console.error(e);
      role = "";
    }

    const hitSubmit = await axios({
      url: `/api/inventory/saveAsDraft`,
      method: "POST",
      headers: {
        AppAuthorization: token,
        "CSTM-COMPID": sessionData?.user?.CompCode,
        "CSTM-ROLE": role,
        "CSTM-UPN": sessionData?.user?.UserPrincipalName,
        "CSTM-NAME": sessionData?.user?.Name,
        "CSTM-EMAIL": sessionData?.user?.Email,
      },
      data: newData,
    })
      .then((res) => {
        formik.resetForm();
        console.log(res);
        successAlertNotificationWithFunction(
          "Sukses",
          "Data berhasil disimpan",
          () => {
            router.push(`/hsse/inventory/detail/${res.data.data.id}`);
          }
        );
        return res;
      })
      .catch((res) => {
        console.error(res.response);
        let errorMessages = [];

        try {
          errorMessages = Object.entries(
            res.response.data.message.errors
          ).flatMap(([field, messages]) => {
            return messages.map((message) => ({ field, message }));
          });
        } catch (error) {
          // Handle the error appropriately
          errorMessages = [
            {
              field: "Error",
              message: res.data
                ? res.data
                : "Data gagal disimpan. Silahkan dicoba beberapa saat lagi",
            },
          ];
        }

        const title = "Error";
        const message =
          errorMessages.length > 0
            ? errorMessages
                .map(({ field, message }) => `${field}: ${message}`)
                .join("\n")
            : "";

        errorAlertNotification(title, message);
      });
  };

  const SubmitHandler = async (newData) => {
    let role = "";
    const compId = sessionData?.user?.CompCode;
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
      console.log(role, "ROLE");
    } catch (e) {
      console.error(e);
      role = "";
    }

    const hitSubmit = dispatch(
      SubmitData(compId, role, upn, name, email, newData)
    )
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotificationWithFunction(
            "Sukses",
            "Data berhasil disubmit",
            () => {
              router.push(`/hsse/inventory`);
            }
          );
          formik.resetForm();
        } else {
          let errorMessages = [];
          if (res.response.status === 401) {
            return errorAlertNotification("Error", res.response.data.message);
          }

          if (res.response.status === 409) {
            return errorAlertNotification("Error Duplicate", "Duplicate Data");
          }

          try {
            errorMessages = Object.entries(res.response.data.errors).flatMap(
              ([field, messages]) => {
                return messages.map((message) => ({ field, message }));
              }
            );
          } catch (error) {
            // Handle the error appropriately
            console.log(error);
            errorMessages = [
              {
                field: "Error",
                message: res.data
                  ? res.data
                  : "Data gagal disimpan. Silahkan dicoba beberapa saat lagi",
              },
            ];
          }

          const title = "Error";
          const message =
            errorMessages.length > 0
              ? errorMessages
                  .map(({ field, message }) => `${field}: ${message}`)
                  .join("\n")
              : "";

          errorAlertNotification(title, message);
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [imageList, setImageList] = useState([]);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (
      formik.touched.inventoryDetailGambar &&
      imageList.length == 0 &&
      formik.values.inventoryDetailGambar.length == 0
    ) {
      setImageError(true);
    } else {
      setImageError(false);
    }
  }, [
    imageList,
    formik.values.inventoryDetailGambar,
    formik.touched.inventoryDetailGambar,
  ]);

  return (
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Inspection"
        breadCrumbParent2="Inventory"
        breadCrumbActive="Add New"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Add Inventory</h2>
      </div>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
            className={`${active === "1" ? "text-dark" : "text-muted"}`}
          >
            Data
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
            className={`${active === "2" ? "text-dark" : "text-muted"}`}
          >
            Approval Log
          </NavLink>
        </NavItem>
      </Nav>
      <Paper elevation={6}>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <div>
                <div className="d-flex justify-content-between w-100 flex-wrap">
                  <div>
                    {!submitLoading ? (
                      <>
                        <Button
                          color="danger"
                          outline
                          onClick={(e) => {
                            e.preventDefault();
                            router.back();
                          }}
                          className="mr-1"
                        >
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <ArrowLeft size={15} color="red" />
                            <span className="ml-1">Back</span>
                          </div>
                        </Button>
                        <Button
                          color="info"
                          onClick={(e) => {
                            e.preventDefault();
                            setButtonState("Save");
                            notificationHandler("Save");
                          }}
                          className="mr-1"
                        >
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <Save size={15} color="white" />
                            <span className="ml-1">Save</span>
                          </div>
                        </Button>
                        <Button.Ripple
                          color="success"
                          onClick={(e) => {
                            e.preventDefault();
                            setButtonState("Submit");
                            notificationHandler("Submit");
                          }}
                          className="mr-1"
                        >
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <Play size={15} />
                            <div className="ml-1" id="confirmSubmit">
                              Submit
                            </div>
                          </div>
                        </Button.Ripple>
                      </>
                    ) : (
                      <Button.Ripple
                        color="primary"
                        disabled={true}
                        onClick={() => {}}
                      >
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Submitting...</span>
                        </>
                      </Button.Ripple>
                    )}
                  </div>
                </div>
                <AddNewInventory
                  formik={formik}
                  token={token}
                  imageList={imageList}
                  setImageList={setImageList}
                  sessionData={sessionData}
                  imageError={imageError}
                />
              </div>
            </TabPane>
            <TabPane tabId="2">
              <div className="d-flex justify-content-between w-100 flex-wrap">
                <div
                  className="d-flex flex-wrap"
                  style={{ gap: 20, width: "70%" }}
                >
                  {/* <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <Save />
                        <div className="ml-1">Save</div>
                      </div>
                    )}
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ExternalLink />
                        <div className="ml-1">Submit</div>
                      </div>
                    )}
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    disabled={submitLoading}
                    onClick={() => {
                      setValues({
                        status: 4,
                      });
                      setSubmitLoading(true);
                    }}
                  >
                    {submitLoading && values.status === 4 ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Approving...</span>
                      </>
                    ) : (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <ArrowLeft />
                        <div className="ml-1">Back</div>
                      </div>
                    )}
                  </Button.Ripple> */}
                </div>
              </div>
              <div className="mt-4">
                <Table responsive className="border">
                  <thead>
                    <tr>
                      <th className="w-5 text-left">No</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">User</th>
                      <th className="text-left">Message</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Lead Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {[{}].map((data) => (
                      <CreateTableRow
                        key={data?.id}
                        {...{ data, router, token: "a" }}
                      />
                    ))} */}
                  </tbody>
                </Table>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Paper>
    </div>
  );
};

AddInventory.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query, params } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    // await store.dispatch(
    //   getAllInventoryByID(params.id, {
    //     "CSTM-COMPID": "01",
    //     "CSTM-NAME": "Mega",
    //     "CSTM-EMAIL": "teguh.valencia@kalbecorp.com",
    //     "CSTM-ROLE": "HSSE-INSP",
    //     "CSTM-UPN": "teguh.valencia@kalbe.co.id",
    //   })
    // );

    // console.log(dataDetailInventory);
    return {
      props: {
        token,
        //dataDetailInventory,
        query,
        sessionData,
      },
    };
  }
);

export default connect((state) => state)(AddInventory);
