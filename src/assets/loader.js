console.log('[-] Loader ready');

window['__contentRoot'] = '';
window['__apiRoot'] = '';

window['deferredCoreReady'] = null;
window['TmpCorePromise'] = new Promise((resolve) => {
	window['deferredCoreReady'] = resolve;
});

window['__angularReadyResolver'] = null;
window['__angularReadyPromise'] = new Promise(function (resolve) {
	window['__angularReadyResolver'] = resolve;
});

function loadSvgSprite() {
	const xhr = new XMLHttpRequest();
	xhr.open('get', 'images/tc-icons-sprite.svg', true);
	xhr.onload = function () {
		const div = document.createElement('div');
		div.innerHTML = this.responseText;
		document.body.insertBefore(div, document.body.childNodes[0]);
	};
	xhr.send(null);
}

function loadTmpCore() {
	let fragment = document.createDocumentFragment();

	const script = createScript('scripts/tmp_core.js', initMainApp);

	fragment.appendChild(script);
	document.body.appendChild(fragment);
	fragment = null;
}

// function loadSubAppsList() {
// 	console.log('Load sub-apps list');
// 	return fetch('sub-apps/tmp_apps.json')
// 		.then(response => response.json())
// 		.then(data => {
// 			console.log('App list', data);
// 			window['TmpCore'].environment.subAppList = data;
// 		})
// 		.catch(err => console.error(err));
// }
//
function loadMainApp() {
	let fragment = document.createDocumentFragment();

	const script = createScript('app.js', () => {
		document.querySelector('#shell').classList.remove('loading');
		console.log('Host App Started.');
	});
	fragment.appendChild(script);
	document.body.appendChild(fragment);
	fragment = null;
}

function createScript(src, onLoad) {
	const tag = document.createElement('script');
	tag.onload = onLoad;
	tag.onerror = () => console.error('Loading error for', src);
	tag.async = false;
	tag.setAttribute('src', src);
	return tag;
}

function initMainApp() {
	// // for localization engine
	// window['TmpCore'].environment.contentRoot = '.';
	// window['TmpCore'].environment.localisationBaseFolder = 'i18n/data';
	// window['TmpCore'].environment.availableLocales = [
	// 	{code: 'en-GB', _hash: 'none'},
	// 	{code: 'ua-UA', _hash: 'none'}
	// ];

	window['TmpCorePrePromise'].then(() => {
		// start TMP (inform it host is ready)
		window['__angularReadyResolver'](); // mimic angular part is ready
		return window['TmpCorePromise'].then(() => {
			console.log('Loading main application...');
			loadMainApp();
		});
		// return loadSubAppsList().then(() => {
		// 	// start TMP (inform it host is ready)
		// 	window['__angularReadyResolver'](); // mimic angular part is ready
		// 	window['TmpCorePromise'].then(() => {
		// 		console.log('Loading main application...');
		// 		loadMainApp();
		// 	});
		// })
	});
}

loadSvgSprite();
loadTmpCore();
