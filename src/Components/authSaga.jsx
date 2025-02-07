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