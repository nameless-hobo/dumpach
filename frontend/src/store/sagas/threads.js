import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import types from '../types';

function* getThreads(boardId) {
  try {
    const response = yield axios.get(`/api/threads/${boardId}`);

    if (response.status === 200) {
      yield put({ type: types.threads.GET_THREADS_SUCCESS, data: response.data.data });
    }
  } catch (err) {
    console.log(err);
  }
}

function* threadsSaga() {
  yield takeLatest(types.threads.GET_THREADS, getThreads);
}

export default threadsSaga;
