import types from '../types';

const initialState = {
  isFetching: false,
  list: [],
  count: 0,
  isLastPage: true
};

const threads = (state = initialState, action) => {
  switch (action.type) {
    case types.threads.GET_THREADS:
      return {
        ...state,
        isFetching: true,
        list: []
      };
    case types.threads.GET_THREADS_SUCCESS:
      return {
        isFetching: false,
        list: action.data.data,
        count: action.data.count,
        isLastPage: action.data.is_last_page
      };
    default:
      return state;
  }
};

export default threads;
