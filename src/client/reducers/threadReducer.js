const defaultState = {};

const threadReducer = (state = defaultState, action) => {
	let _newState = {};
    
	switch (action.type) {
		case 'THREAD_INIT':
			_newState = Object.assign({}, state, action.payload);
			break;
		default:
			_newState = state;
			break;
	}

	return _newState;
};

export default threadReducer;