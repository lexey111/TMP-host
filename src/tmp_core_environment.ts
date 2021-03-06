/* eslint-disable */
declare const SUBAPPS;

(function initEnvironment() {
	if (!window.TmpCore || !window.TmpCore.environment) {
		throw new Error('Global windows.TmpCore object is not ready!');
	}

	window.TmpCore.environment.servicesBundle = '';
	window.TmpCore.environment.uiBundle = '';
	window.TmpCore.environment.subAppList = SUBAPPS;
	// @ts-ignore
	window.TmpCore.environment.availableLocales = [
		{
			code: 'fallback',
			hash: 'version 1',
		},
		{
			code: 'en-GB',
			hash: 'version 1',
		},
		{
			code: 'nl-NL',
			hash: 'version 1',
		},
	];
	window.TmpCore.environment.availableDictionaries = {};

	console.log('Host environment ready.');
	console.log('Loading sub-apps config...');

	Object.keys(window.TmpCore.environment.subAppList).forEach(appCode => {
		const enabled = (localStorage.getItem('tmp.subapp.' + appCode) || 'on') === 'on';
		const homeCardEnabled = (localStorage.getItem('tmp.subapp.homecard' + appCode) || 'on') === 'on';

		window.TmpCore.environment.subAppList[appCode].enabled = enabled;
		window.TmpCore.environment.subAppList[appCode].homeCardEnabled = homeCardEnabled;

		console.log(`  Application bundle "${appCode}": ${enabled ? 'enabled' : 'disabled'}`);
	});
})();
