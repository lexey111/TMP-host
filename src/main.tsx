import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {I18nService} from 'TMPCore/services';
import {App} from './app';
import {ComposerApp} from './app/composer-app';

import './styles/shell.less';

I18nService.setCurrentLocale('fallback');
I18nService.getAvailableLocales();
void I18nService.getLocaleByCode('fallback');
void I18nService.getFullLocaleData('fallback');

declare const IS_COMPOSER;
if (IS_COMPOSER) {
	startComposerApp();
} else {
	startApp();
}

function startComposerApp(): void {
	ReactDOM.render(
		<ComposerApp/>,
		document.getElementById('shell')
	);
}

function startApp(): void {
	ReactDOM.render(
		<Router>
			<App/>
		</Router>,
		document.getElementById('shell')
	);
}

export function reStartApp(): void {
	console.log('Unmount temporary shell...');
	ReactDOM.unmountComponentAtNode(document.getElementById('shell'));
	startApp();
}

