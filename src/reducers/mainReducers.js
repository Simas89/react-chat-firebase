import {
	MAIN_UPDATE_FORM_INPUTS,
	SET_SNACK,
	MAIN_SHOW_INTRO,
	MAIN_ANIMATE_MESSAGE,
	SET_SWIPED_SCREEN,
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
	state = {
		showIntro: true,
		animateMessage: false,
		swipedScreen: { direction: 'LEFT', deltaX: 0 },
	},
	action
) => {
	switch (action.type) {
		case MAIN_SHOW_INTRO:
			return { ...state, showIntro: false };

		case MAIN_ANIMATE_MESSAGE:
			return { ...state, animateMessage: action.payload };
		case SET_SWIPED_SCREEN:
			return { ...state, swipedScreen: action.payload };

		default:
			return state;
	}
};
