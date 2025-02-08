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
    <div className="">
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
            <Form >
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


import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./types";


const initialState = { user: null, loading: false, error: null };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default authReducer;

import { takeLatest, put, call } from 'redux-saga/effects';
import { loginFailure, loginSuccess } from './authActions';
import { LOGIN_REQUEST } from './types';


const fakeLoginApi = (credentials) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'password') {
        resolve({ username: 'admin', token: '123456' });
      } else {
        reject('Invalid credentials');
      }
    }, 1000);
  });

function* loginSaga(action) {
  try {
    const user = yield call(fakeLoginApi, action.payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error));
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}