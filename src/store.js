import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { formInputsReducer, snackReducer } from './reducers/mainReducers';
import { userReducer } from 'reducers/userReducers';
import { channelReducer } from 'reducers/channelReducers';

const rootReducer = combineReducers({
	formInputs: formInputsReducer,
	user: userReducer,
	snack: snackReducer,
	channel: channelReducer,
});

const initialState = {};

// const middleware = [thunk];
// require('redux-immutable-state-invariant').default(),

const middleware = process.env.NODE_ENV !== 'production' ? [thunk] : [thunk];

const store = createStore(
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
