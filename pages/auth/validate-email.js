import Link from "next/link";
import Image from "next/image";
import InputPasswordToggle from "src/@core/components/input-password-toggle";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { getCsrfToken, getSession } from "next-auth/react";
import { useState } from "react";
import metadata from "appsettings.json";
import InputUsernameIcon from "src/@core/components/input-username-icon";
import { useRouter } from "next/router";
import { onLoginGuest } from "helpers/auth";
import axios from "axios";
import { AUTH_URL } from "constant";
import { getHeaders } from "helpers/utils";

const ValidateEmail = (props) => {
  const { csrfToken, authError } = props;
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  const [code, setCode] = useState(null);

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="12"
          sm="12"
        >
          <Col
            className="h-100 d-flex flex-column justify-content-between px-xl-2 mx-auto"
            sm="8"
            md="6"
            lg="8"
          >
            <div className="my-auto">
              <Link href="/">
                <a className="d-flex justify-content-center">
                  <Image
                    src="/images/logo/xyz-logo.png"
                    width={117}
                    height={49}
                  />
                </a>
              </Link>
              <CardTitle
                tag="h2"
                className="text-center font-weight-bold mt-2 mb-4"
              >
                HSSE
              </CardTitle>
              <Form
                method="POST"
                action="/api/auth/callback/credentials"
                className="auth-login-form mt-2"
                onSubmit={(e) => setLoginLoading(true)}
              >
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <FormGroup className="d-flex justify-content-center">
                  <Col sm="2" md="4" lg="6">
                    <Label className="form-label" for="login-email">
                      Security Code
                    </Label>
                    <Input
                      type={"text"}
                      id="code"
                      name="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <p id="errorMsg" className="text-danger text-center my-2">
                      {authError &&
                        "User is not registered or password is incorrect."}
                    </p>
                    <Button.Ripple
                      type="submit"
                      disabled={loginLoading}
                      color="primary"
                      block
                      className="mt-2"
                    >
                      {loginLoading ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-1">Loading...</span>
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button.Ripple>
                  </Col>
                </FormGroup>
              </Form>
            </div>
            <div className="auth-footer-btn d-flex flex-column justify-content-center align-items-center my-2">
              <p className="m-0">HSSE Version {metadata.appVersion}</p>
              <p className="m-0">
                &#169;{new Date().getFullYear()} - PT. Kalbe Farma Tbk.
              </p>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;

  const sessionData = await getSession(ctx);

  if (sessionData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
      authError: query.error ? true : false,
    },
  };
}

export default ValidateEmail;
