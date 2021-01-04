import { SET_CHANNEL } from 'types/channelTypes';

export const channelReducer = (state = { currentChannel: null }, action) => {
	switch (action.type) {
		case SET_CHANNEL:
			return { ...state, currentChannel: action.payload };

		default:
			return state;
	}
};
