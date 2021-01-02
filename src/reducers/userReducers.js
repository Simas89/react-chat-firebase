import { SET_USER, CLEAR_USER } from 'types/userTypes';

export const userReducer = (
	state = { currentUser: null, isLoading: true },
	action
) => {
	switch (action.type) {
		case SET_USER:
			return { ...action.payload, isLoading: false };

		case CLEAR_USER:
			return { ...state, currentUser: null, isLoading: false };

		default:
			return state;
	}
};
