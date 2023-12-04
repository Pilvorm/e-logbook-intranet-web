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
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { useState, useEffect, useReducer} from "react";
import metadata from "appsettings.json";
import InputUsernameIcon from "src/@core/components/input-username-icon";
import { useRouter } from "next/router";
import {
  errorAlertNotification, errorAlertNotificationCode, errorAlertNotificationGlobal, successAlertNotification,
} from "components/notification";
import { onLoginGuest } from "helpers/auth";
import jwt_decode from "jwt-decode";
import useMobileDetector from "components/useMobileDetector"
const sign = require("jwt-encode");



const LoginPage = (props) => {
  const { csrfToken, query } = props;
  const isMobileWidth = useMobileDetector();
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  const [isError, setIsError] = useState(query.error == "true" ? true : false);
  const [isErrorValidate, setIsErrorValidate] = useState(query.isError == "true" || query.invalid == "true" ? true : false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const secret = process.env.NEXT_PUBLIC_API_SECRET_KEY_JWT ?? "";

  useEffect(() => {
    if (query.error == "true") {
      setTimeout(() => {
        setIsError(false)
      }, 100)
    }
    if (query.isError == "true" || query.invalid == "true") {
      setTimeout(() => {
        setIsErrorValidate(false)
      }, 100)
    }
  }, [])

  const AlertError = () => {
    errorAlertNotificationGlobal("Error",
    <div dangerouslySetInnerHTML={{__html: 
      `Error: Anda gagal login. Mohon dicoba login ke <a href="https://sentinel.onekalbe.com/identity" target="_blank">Sentinel</a>, jika berhasil silakan menghubungi tim helpdesk untuk pembuatan ticket incident untuk apps ini, 
      sedangkan jika gagal login di sentinel mohon menghubungi helpdesk untuk pengecekan user domain anda. helpdesk dapat dihubungi dengan cara sbb :</br>
      <ul><li>helpdesk.kalbe.co.id</li><li>WA : 0811-1528-080</li><li>phone : 021-42873888 ext 2222</li></ul>terima kasih.`
    }} ></div>)
    return (
      <div
      />
    )
  }

  const onResendCode = async() => {
    if (typeof window !== "undefined") {
      const nameEncode = localStorage.getItem("name");
      const emailEncode = localStorage.getItem("email");
      const name = jwt_decode(nameEncode);
      const email = jwt_decode(emailEncode);
      await onLoginGuest({name, email})
        .then((res) => {
          return successAlertNotification("Success", "Security code telah dikirimkan ke email anda, silakan masukkan security code yang telah dikirimkan tersebut.")
        })
        .catch((err) => console.log(err, 'ini err <<<<<'))
    }
  };

  const AlertErrorValidate = () => {
    if (query.invalid == "true") {
      errorAlertNotification("Error", "Silahkan input security code dengan benar")
    } else {
      errorAlertNotificationCode("Error", "", () => onResendCode())
    }
    return (
      <div
      />
    )
  }

  const ValidateEmail = ({
  }) => {
    const [loginLoading, setLoginLoading] = useState(false);
    const [code, setCode] = useState(null);

    const [remainingTime, setRemainingTime] = useState(300);

    useEffect(() => {
      let timer = null;
        if (remainingTime > 0) {
          // Function to update the remaining time every second
          timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);
        } 

      return () => {
        clearInterval(timer);

      };
    }, [remainingTime]);
    return (
      <Row className="auth-inner m-0"
      >
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
                    src="/images/logo/kalbe-logo.png"
                    width={113}
                    height={51}
                  />
                </a>
              </Link>
              <CardTitle
                tag="h2"
                className="text-center font-weight-bold mt-2 mb-4"
              >
                E-Logbook
              </CardTitle>
              <Form
                className="auth-login-form mt-2"
                onSubmit={async(e) => {
                  e.preventDefault()
                  setIsErrorValidate(false)
                  setLoginLoading(true)
                  try {
                    if (code === null || code === "") {
                      setLoginLoading(false);
                      return errorAlertNotification("Error", "Mohon masukkan security code yang telah dikirim ke email Anda!")
                    }
                    const response = await signIn("credentials", {
                      callbackUrl: "/",
                      redirect: true,
                      code: code,
                      name: query.name,
                      email: query.email,
                      isMobileWidth: isMobileWidth
                    });
                    if (response.error) {
                      errorAlertNotification("Error", response.error)
                    }
                  } catch(err) {}
                  setLoginLoading(false)
                }}
              >
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
                    {
                      typeof window !== "undefined" &&
                      <p className="mt-1">Silakan masukkan security code yang telah dikirimkan ke email anda {`(${jwt_decode(localStorage.getItem("email"))})`}</p>
                    }
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
              <p className="m-0">E-Logbook Version {metadata.appVersion}</p>
              <p className="m-0">
                &#169;{new Date().getFullYear()} - PT. XYZ Tbk.
              </p>
            </div>
          </Col>
        </Col>
      </Row>
    )
  };

  const LoginAsGuest = ({
  }) => {
    const [loginLoading, setLoginLoading] = useState(false);
    const [error, setError] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLoginGuest = async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      const loginData = {
        name: name,
        email: email,
      };
      if (name === null || name === "") {
        setLoginLoading(false);
        return errorAlertNotification("Error", "Mohon mengisi Name terlebih dahulu")
      }
      if (email === null || email === "") {
        setLoginLoading(false);
        return errorAlertNotification("Error", "Mohon mengisi Email terlebih dahulu")
      }
      const regex = /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?com\.com)([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (!regex.test(email)) {
        setLoginLoading(false);
        return errorAlertNotification("Error", "Format alamat email yang anda input salah")
      }
      try {
        return onLoginGuest(loginData)
          .then((data) => {
            if (data.status === 400) {
              setLoginLoading(false);
              let a = ""
              if (data.statusText.Name) {
                setErrorMessage(data.statusText.Name[0] ?? "");
                a = data.statusText.Name[0]
              } else {
                setErrorMessage(data.statusText.Email[0] ?? "");
                a = data.statusText.Email[0]
              }
              setError(true);
              return (errorAlertNotification("Error", a))
            }
            if (data.securityCode) {
              const emailEncode = sign(email, secret);
              const nameEncode = sign(name, secret);
              localStorage.setItem('name', nameEncode);
              localStorage.setItem('email', emailEncode);
              if (typeof window !== "undefined") {
              }
              router.push({
                pathname: router.pathname,
                query: `validate=${true}`,
              });
            }
          })
          .catch((err) => console.log(err));
      } catch (error) {
        throw new Error("There was an error on user authentication");
      }
    };

    return (
      <>
      {
        query.validate === "true" ?
        <ValidateEmail />
        :
        <Row className="auth-inner m-0"
        >
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
                      src="/images/logo/kalbe-logo.png"
                      width={113}
                      height={51}
                    />
                  </a>
                </Link>
                <CardTitle
                  tag="h2"
                  className="text-center font-weight-bold mt-2 mb-4"
                >
                  E-Logbook
                </CardTitle>
                <Form
                  method="POST"
                  action="/api/auth/callback/credentials"
                  className="auth-login-form mt-2"
                  onSubmit={(e) => handleLoginGuest(e)}
                >
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <FormGroup className="d-flex justify-content-center">
                    <Col sm="2" md="4" lg="6">
                      <Label className="form-label" for="login-email">
                        Name
                      </Label>
                      <Input
                        type={"text"}
                        placeholder={"ex: john doe"}
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          // onChange(e.target.value)
                        }}
                      />
                    </Col>
                    <Input
                      style={{
                        display: "none",
                      }}
                      id="guest"
                      name="guest"
                      value={true}
                    />
                  </FormGroup>
                  <FormGroup className="d-flex justify-content-center">
                    <Col sm="2" md="4" lg="6">
                      <Label className="form-label" for="login-email">
                        Email
                      </Label>
                      <Input
                        type={"text"}
                        placeholder={"ex: john.doe@mail.com"}
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          // onChange("email", e.target.value)
                        }}
                      />
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
                            <span className="ml-1">Logging in...</span>
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button.Ripple>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
              <div className="auth-footer-btn d-flex flex-column justify-content-center align-items-center my-2">
                <p className="m-0">E-Logbook Version {metadata.appVersion}</p>
                <p className="m-0">
                  &#169;{new Date().getFullYear()} - PT. XYZ Tbk.
                </p>
              </div>
            </Col>
          </Col>
        </Row>
      }
      </>
    );
  };

  return (
    <div className="auth-wrapper auth-v2">
      {
        isError == true ? <AlertError /> : null
      }
      {
        isErrorValidate == true ? <AlertErrorValidate /> : null
      }
      {query.asGuest === "true" || query.validate === "true" ? (
        <LoginAsGuest />
      ) : (
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
                      src="/images/logo/kalbe-logo.png"
                      width={113}
                      height={51}
                    />
                  </a>
                </Link>
                <CardTitle
                  tag="h2"
                  className="text-center font-weight-bold mt-2 mb-4"
                >
                  E-Logbook
                </CardTitle>
                <Form
                  className="auth-login-form mt-2"
                  onSubmit={async(e) => {
                    e.preventDefault();
                    setIsError(false)
                    setLoginLoading(true)
                    try {
                      if (username === null || username === "" || password === null || password === "") {
                        setLoginLoading(false);
                        return errorAlertNotification("Error", "Username atau password tidak boleh kosong!")
                      }
                      const response = await signIn("credentials", {
                        callbackUrl: query.url ? `/home?url=${query.url}` : "/home",
                        redirect: true,
                        username,
                        password,
                        applicationCode: "HSSE",
                        getProfile: true,
                        isMobileWidth: isMobileWidth,
                      });
                      if (response.error) {
                        errorAlertNotification("Error", <div dangerouslySetInnerHTML={{__html: response.error}} ></div>)
                      }
                    } catch(err) {
                      // console.log(err, 'di 335');
                    }
                    setLoginLoading(false)
                  }}
                >
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <FormGroup className="d-flex justify-content-center">
                    <Col sm="2" md="4" lg="6">
                      <Label className="form-label" for="login-email">
                        Username
                      </Label>
                      <InputUsernameIcon
                        className="input-group-merge"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup className="d-flex justify-content-center">
                    <Col sm="2" md="4" lg="6">
                      <Label className="form-label" for="password">
                        Password
                      </Label>
                      <InputPasswordToggle
                        className="input-group-merge"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
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
                            <span className="ml-1">Logging in...</span>
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button.Ripple>
                    </Col>
                  </FormGroup>
                </Form>
                <Col sm="2" md="4" lg="6" className="m-auto">
                  <Button.Ripple
                    type="submit"
                    color="primary"
                    block
                    className="mt-2"
                    id="guest"
                    onClick={() => {
                      router.push({
                        pathname: `${router.pathname}`,
                        query: `asGuest=${true}`,
                      });
                    }}
                  >
                    Login as guest
                  </Button.Ripple>
                </Col>
              </div>
              <div className="auth-footer-btn d-flex flex-column justify-content-center align-items-center my-2">
                <p className="m-0">E-Logbook Version {metadata.appVersion}</p>
                <p className="m-0">
                  &#169;{new Date().getFullYear()} - PT. XYZ Tbk.
                </p>
              </div>
            </Col>
          </Col>
        </Row>
      )}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { query, req, res } = ctx;

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
      query: query,
    },
  };
}

export default LoginPage;
