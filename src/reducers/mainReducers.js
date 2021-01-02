import { MAIN_UPDATE_FORM_INPUTS } from 'types/mainTypes';

export const formInputsReducer = (state = { name: '', email: '' }, action) => {
	switch (action.type) {
		case MAIN_UPDATE_FORM_INPUTS:
			console.log(action.payload);
			return { ...state, [action.payload.field]: action.payload.value };

		default:
			return state;
	}
};
