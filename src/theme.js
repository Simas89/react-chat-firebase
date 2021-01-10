import { createMuiTheme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import blueGrey from '@material-ui/core/colors/blueGrey';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#2E4057',
		},
		background: { light: '#44B7ED', dark: '#1E73B6' },
		white: '#FAFAFA',
		accent: {
			// orange: deepOrange[500],
			// green: green[300],
			// blueGrey: blueGrey[700],
			// yellow: yellow[500],
			orange: '#1E73B6',
			green: '#44B7ED',
			blueGrey: blueGrey[700],
			yellow: yellow[500],
		},
	},
	classBg: {
		background: 'linear-gradient(0deg,#1E73B6 0%,#44B7ED 100%)',
	},

	props: {
		MuiButtonBase: {
			disableRipple: true,
		},
	},
	overrides: {
		MuiCssBaseline: {
			'@global': {
				html: {
					WebkitFontSmoothing: 'auto',
				},
			},
		},
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
