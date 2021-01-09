import {
	MAIN_UPDATE_FORM_INPUTS,
	SET_SNACK,
	MAIN_SHOW_INTRO,
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

export const introAnimationReducer = (state = { showIntro: false }, action) => {
	switch (action.type) {
		case MAIN_SHOW_INTRO:
			return { ...state, showIntro: false };

		default:
			return state;
	}
};
