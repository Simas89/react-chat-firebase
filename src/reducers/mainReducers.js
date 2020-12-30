export const firstReducer = (state = { value: 25 }, action) => {
	switch (action.type) {
		case 'TEST':
			console.log('Test from reducer');
			break;

		default:
			return state;
	}
};
