import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { StylesProvider, MuiThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import 'fontsource-roboto';
import theme from 'theme';
// import firebase from 'firebase';

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<ThemeProvider theme={theme}>
				<StylesProvider injectFirst>
					<CssBaseline />
					<App />
				</StylesProvider>
			</ThemeProvider>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root')
);

reportWebVitals();
serviceWorker.register();
