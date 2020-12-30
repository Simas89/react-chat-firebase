import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { firstReducer } from './reducers/mainReducers';

const rootReducer = combineReducers({ firstReducer });

const initialState = {};

// const middleware = [thunk];

const middleware =
	process.env.NODE_ENV !== 'production'
		? [require('redux-immutable-state-invariant').default(), thunk]
		: [thunk];

const store = createStore(
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
