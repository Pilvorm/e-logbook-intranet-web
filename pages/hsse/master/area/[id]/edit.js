import { ArrowBack } from "@mui/icons-material";
import Select from "react-select";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";
import { Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { ArrowLeft, Save } from "react-feather";
import { connect, useDispatch } from "react-redux";
import { editMasterArea } from "redux/actions/master/area";
import {
  Button,
  Card,
  Col,
  CustomInput,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { getSBUAll, reauthenticate } from "redux/actions/auth";
import { getMasterAreaById } from "redux/actions/master/area";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  area: Yup.string().required("Area is required"),
  status: Yup.string().required("Status is required"),
  site: Yup.string().required("Company is required"),
});

const EditMasterArea = (props) => {
  const { token, data, dataSBU } = props;
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const handleFormSubmit = (values, actions) => {
    setIsSubmitting(true);

    const { id, creator, site, area, status, companyCode } = values;

    confirmAlertNotification(
      "Edit Area",
      "Apakah Anda yakin perbaharui data ini?",
      () => {
        dispatch(
          editMasterArea(data.id, {
            ...data,
            id: data.id,
            creator: creator,
            site: site,
            area: area,
            status: status,
            companyCode: companyCode,
          })
        ).then((res) => {
          if (res.status >= 200 && res.status <= 300) {
            actions.setSubmitting(false);
            successAlertNotification("Success", "Data berhasil disimpan");
            router.push({
              pathname: "/hsse/master/area",
            });
          } else {
            actions.setSubmitting(false);
            console.error(res);
            errorAlertNotification("Error", "Data gagal disimpan");
          }
        });
      },
      () => {
        actions.setSubmitting(false);
      }
    );
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="Master"
        breadCrumbParent2="Area"
        breadCrumbActive="Edit Master Area"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Edit Master Area</h2>
      </div>

      <Card className="p-2">
        <Formik
          enableReinitialize
          initialValues={{
            id: data.id,
            creator: data.creator,
            site: session?.user?.CompName,
            area: data.area,
            status: data.status,
            companyCode: data.companyCode,
          }}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Button
                color="danger"
                outline
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
                className="mr-1 mb-1 mt-1"
              >
                <div className="d-flex" style={{ alignItems: "center" }}>
                  <ArrowLeft size={15} color="red" />
                  <span className="ml-1">Back</span>
                </div>
              </Button>

              <Button.Ripple
                color="primary"
                className="btn-next mr-1"
                type="submit"
                disabled={formik.isSubmitting}
              >
                <Save size={18} />
                <span className="align-middle ml-1 d-sm-inline-block d-none">
                  Save
                </span>
              </Button.Ripple>

              <div className="py-3">
                <Row>
                  <FormGroup tag={Col} md="12">
                    <Label className="form-label">ID</Label>
                    <Input
                      type="text"
                      name="id"
                      id="id"
                      value={formik.values.id}
                      disabled
                    />
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup tag={Col} md="12">
                    <Label className="form-label">Creator</Label>
                    <Input
                      type="text"
                      name="creator"
                      id="creator"
                      placeholder={formik.values.creator}
                      value={formik.values.creator}
                      disabled
                    />
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup tag={Col} md="12">
                    <Label className="form-label">Company</Label>
                    {/* <Select
                      menuPortalTarget={document.body}
                      onChange={(e) => {
                        formik.setFieldValue("companyCode", e.value);
                        formik.setFieldValue("site", e.label);
                      }}
                      className="react-select"
                      classNamePrefix="select"
                      isSearchable={true}
                      isDisabled={true}
                      options={dataSBU.map((el) => {
                        return {
                          ...el,
                          value: el.idmCompCode,
                          label: el.idmCompName,
                        };
                      })}
                    /> */}
                    <Input
                      type="text"
                      name="companyCode"
                      id="companyCode"
                      defaultValue={formik.values.site}
                      disabled
                    />
                    {formik.touched.site && formik.errors.site ? (
                      <div className="invalid-feedback">
                        {formik.errors.site}
                      </div>
                    ) : null}
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup tag={Col} md="12">
                    <Label className="form-label">Area</Label>
                    <Input
                      type="text"
                      name="area"
                      id="area"
                      value={formik.values.area}
                      onChange={(e) => {
                        formik.setFieldValue("area", e.target.value);
                      }}
                      className={
                        formik.touched.area && formik.errors.area
                          ? "is-invalid"
                          : ""
                      }
                    />
                    {formik.touched.area && formik.errors.area ? (
                      <div className="invalid-feedback">
                        {formik.errors.area}
                      </div>
                    ) : null}
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup tag={Col} md="12">
                    <Label className="form-label">Status</Label>
                    <div>
                      <CustomInput
                        type="radio"
                        id="statusActive"
                        name="status"
                        inline
                        label="Active"
                        value="Active"
                        checked={formik.values.status === "Active"}
                        onChange={(e) => {
                          formik.setFieldValue("status", e.target.value);
                        }}
                      />
                      <CustomInput
                        type="radio"
                        id="statusInactive"
                        name="status"
                        inline
                        label="Inactive"
                        value="Inactive"
                        checked={formik.values.status === "Inactive"}
                        onChange={(e) => {
                          formik.setFieldValue("status", e.target.value);
                        }}
                      />
                    </div>
                  </FormGroup>
                </Row>
              </div>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

EditMasterArea.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;
    store.dispatch(reauthenticate(token));

    const dataSBU = await store.dispatch(getSBUAll());

    const { id } = ctx.query;

    const res = await store.dispatch(getMasterAreaById(id));

    if (!res.data) {
      return {
        redirect: {
          destination: "/hsse/master/area",
          permanent: false,
        },
      };
    }

    return {
      props: {
        token,
        data: res.data,
        dataSBU,
      },
    };
  }
);

export default connect((state) => state)(EditMasterArea);
