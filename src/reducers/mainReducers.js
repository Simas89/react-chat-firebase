import {
	MAIN_UPDATE_FORM_INPUTS,
	SET_SNACK,
	MAIN_SHOW_INTRO,
	MAIN_ANIMATE_MESSAGE,
} from 'types/mainTypes';

export const formInputsReducer = (state = { name: '', email: '' }, action) => {
	switch (action.type) {
		case MAIN_UPDATE_FORM_INPUTS:
			return { ...state, [action.payload.field]: action.payload.value };

		default:
			return state;
	}
};

export const snackReducer = (
	state = { severity: '', message: '', open: false },
	action
) => {
	switch (action.type) {
		case SET_SNACK:
			return { ...state, ...action.payload };

		default:
			return state;
	}
};

export const animationsReducer = (
	state = { showIntro: false, animateMessage: false },
	action
) => {
	switch (action.type) {
		case MAIN_SHOW_INTRO:
			return { ...state, showIntro: false };

		case MAIN_ANIMATE_MESSAGE:
			return { ...state, animateMessage: action.payload };

		default:
			return state;
	}
};
