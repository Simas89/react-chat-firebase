import {
	SET_CHANNEL,
	SET_CHANNEL_PRIVATE,
	SET_STARRED,
	SET_SHOW_ONLY_STARRED,
	SET_NEW_MESSAGES,
	SET_CHAT_WINDOW_SCROLL_PX,
} from 'types/channelTypes';

export const channelReducer = (
	state = {
		currentChannel: null,
		isPrivate: false,
		starred: [],
		showOnlyStarred: false,
		newMessages: [],
		chatScroll: 0,
	},
	action
) => {
	switch (action.type) {
		case SET_CHANNEL:
			return { ...state, currentChannel: action.payload };

		case SET_CHANNEL_PRIVATE:
			return { ...state, isPrivate: action.payload };

		case SET_STARRED:
			return { ...state, starred: [...action.payload] };

		case SET_SHOW_ONLY_STARRED:
			return { ...state, showOnlyStarred: action.payload };

		case SET_NEW_MESSAGES:
			return { ...state, newMessages: action.payload };

		case SET_CHAT_WINDOW_SCROLL_PX:
			return { ...state, chatScroll: action.payload };

		default:
			return state;
	}
};
