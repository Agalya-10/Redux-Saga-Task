import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "./authActions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  return (
    <div>
      <h2>Login</h2>
      {user ? (
        <p>
          Welcome, {user.username}! Token: {user.token}
        </p>
      ) : (
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            dispatch(loginRequest(values));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <div>
                <Field type="text" name="username" placeholder="Username" />
                <ErrorMessage name="username" component="p" style={{ color: "red" }} />
              </div>
              <div>
                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage name="password" component="p" style={{ color: "red" }} />
              </div>
              <button type="submit" disabled={loading || isSubmitting}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
