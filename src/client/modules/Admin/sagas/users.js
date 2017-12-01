import { put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  GET_USERS,
  GET_USERS_SUCCEEDED,
  GET_USERS_FAILED,
} from '../duck';
import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from '../../Snackbar/duck';

function* login({ login, password }) {
  try {
    const user = yield fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ login, password }),
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(err.message);
      });

    if (user !== undefined) {
      yield put({ type: LOGIN_SUCCEEDED, user });
      // yield browserHistory.push('/admin/dashboard');
    } else {
      throw new Error('Wrong login or password');
    }
  } catch (e) {
    yield put({ type: LOGIN_FAILED, message: e.message });
    yield put({ type: OPEN_SNACKBAR, message: 'Wrong login or password' });
    yield delay(5000);
    yield put({ type: CLOSE_SNACKBAR });
  }
}

function* usersSaga() {
  yield takeLatest(GET_USERS, login);
}

export default usersSaga;
