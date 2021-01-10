import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';

export const channelReducer = (
	state = { currentChannel: null, isPrivate: false },
	action
) => {
	switch (action.type) {
		case SET_CHANNEL:
			return { ...state, currentChannel: action.payload };

		case SET_CHANNEL_PRIVATE:
			return { ...state, isPrivate: action.payload };

		default:
			return state;
	}
};
