import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {I18nService} from 'TMPCore/services';
import {App} from './app';

import './styles/shell.less';

I18nService.setCurrentLocale('fallback');
I18nService.getAvailableLocales();
void I18nService.getLocaleByCode('fallback');
void I18nService.getFullLocaleData('fallback');

ReactDOM.render(
	<Router>
		<App/>
	</Router>,
	document.getElementById('shell')
);
