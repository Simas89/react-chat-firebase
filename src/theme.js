import { createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import blueGrey from '@material-ui/core/colors/blueGrey';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#2E4057',
		},
		background: lightBlue[500],
		white: '#FAFAFA',
		accent: {
			orange: deepOrange[500],
			green: green[300],
			blueGrey: blueGrey[700],
			yellow: yellow[500],
		},
	},
	props: {
		MuiButtonBase: {
			disableRipple: true,
		},
	},
	overrides: {
		MuiButton: {
			root: {
				'&:hover': {
					backgroundColor: 'inherit',
				},
			},
		},
	},
});

export default theme;
