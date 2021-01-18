import firebase from 'config/firebase';
import { SET_NEW_MESSAGES } from 'types/channelTypes';

const parseObjToArray = (obj) => {
	let parsedMessages = [];
	for (const [key, value] of Object.entries(obj)) {
		parsedMessages.push({ channelId: key, newMessages: value });
	}
	return parsedMessages;
};

const usersRef = firebase.database().ref('users');

export const setNewMessages = (newMessages) => (dispatch, getState) => {
	const currentId = getState().channel.currentChannel.id;
	const chatScroll = getState().channel.chatScroll;

	let parsedNewMessages = newMessages ? parseObjToArray(newMessages) : [];

	const matchingIndex = parsedNewMessages
		.map((e) => e.channelId)
		.indexOf(currentId);

	if (matchingIndex !== -1 && chatScroll < 300) {
		parsedNewMessages.splice(matchingIndex, 1);
	}

	dispatch({
		type: SET_NEW_MESSAGES,
		payload: parsedNewMessages,
	});
};

export const clearCurrentChannelNewMessages = () => (dispatch, getState) => {
	const currentId = getState().channel.currentChannel.id;
	const newMessages = getState().channel.newMessages;
	const uid = getState().user.currentUser.uid;

	const matchingIndex = newMessages.map((e) => e.channelId).indexOf(currentId);

	if (matchingIndex !== -1) {
		newMessages.splice(matchingIndex, 1);
		usersRef.child(uid).child('newMessages').child(currentId).remove();
	}

	dispatch({
		type: SET_NEW_MESSAGES,
		payload: newMessages,
	});
};
