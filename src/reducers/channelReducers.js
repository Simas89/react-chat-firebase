import {
	SET_CHANNEL,
	SET_CHANNEL_PRIVATE,
	SET_STARRED,
} from 'types/channelTypes';

export const channelReducer = (
	state = { currentChannel: null, isPrivate: false, starred: [] },
	action
) => {
	switch (action.type) {
		case SET_CHANNEL:
			return { ...state, currentChannel: action.payload };

		case SET_CHANNEL_PRIVATE:
			return { ...state, isPrivate: action.payload };

		case SET_STARRED:
			return { ...state, starred: [...action.payload] };

		default:
			return state;
	}
};
