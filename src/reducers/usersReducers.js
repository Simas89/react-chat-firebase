import { SET_USERS, CLEAR_USERS, SET_USERS_ALL } from 'types/usersTypes';

export const usersReducer = (state = [], action) => {
	switch (action.type) {
		case SET_USERS:
			return [...state, action.payload];

		case SET_USERS_ALL:
			return action.payload;

		case CLEAR_USERS:
			return [];

		default:
			return state;
	}
};
