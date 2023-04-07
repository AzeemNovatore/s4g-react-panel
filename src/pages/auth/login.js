import React from "react";
import { Row, Col } from "reactstrap";
import { Survey, mail } from "../../utils/image";
import { useState, useContext } from "react";
import { LoaderContext } from "../../context/loadingContext";
import { signInAuth } from "../../services/firebase/actions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/authenticationContext";
import PasswordInput from "../../component/form/inputs/passwordInput";
import InputField from "../../component/form/inputs/input";

export default function Login() {
  const initialFormValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState({ ...initialFormValues });
  const [formError, setFormError] = useState({});
  const { dispatch } = useContext(AuthContext);
  const { setLoading } = useContext(LoaderContext);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const loginFun = async () => {
    setLoading(true);
    await signInAuth(formValues)
      .then((userCredential) => {
        setLoading(false);
        console.log("user", userCredential);
        if (
          userCredential.user.email === "admin@survey4good.com" &&
          formValues.password === "Admin@123"
        ) {
          dispatch({ type: "LOGIN", payload: userCredential.user });
          history.push("/dashboard");
        } else {
          toast.error("Email or password must be Correct");
        }
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        if (formValues.password !== "Admin@123") {
          toast.error("Password is InCorrect");
        }
        if (
          errorCode === "auth/user-not-found" &&
          formValues.password === "Admin@123"
        ) {
          toast.error("User not Found");
        }
      });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = "Email is Required";
    if (!values.password) errors.password = "Password is Required";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateForm = validate(formValues);
    setFormError(validateForm);
    if (Object.keys(validateForm).length > 0)
      return toast.error("Fields are Empty");
    loginFun();
  };

  return (
    <div className="main-login">
      <div className="container-fluid main-login__section p-0">
        <form className="login__section" onSubmit={handleSubmit}>
          <Row>
            <Col lg="6" md="6" sm="12" xs="12" className="image__col">
              <div className="d-flex flex-column survey">
                <h1>Survey 4 Good</h1>
                <p>
                  <b>“Join our Community”</b> <br /> Help us bring everyone
                  together and turn online <br /> information into a resource 4
                  good
                </p>
                <div className="img-box">
                  <img src={Survey} alt="" />
                </div>
              </div>
            </Col>

            <Col lg="6" md="6" sm="12" xs="12" className="login__col">
              <div className="w-100">
                <div className="login-head">
                  <h3>Login</h3>
                </div>
                <div>
                  <InputField
                    label={"Email"}
                    name={"email"}
                    handleChange={handleChange}
                    formError={formError.email ?? ""}
                    icon={mail}
                  />

                  <PasswordInput
                    label={"Password"}
                    name={"password"}
                    handleChange={handleChange}
                    formError={formError.password ?? ""}
                  />

                  <button type="submit">Login</button>
                </div>
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  );
}
