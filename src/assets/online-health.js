self.addEventListener('message', function (e) {
	const data = e.data;
	if (data.cmd === 'run') {
		startPolling(data.apps);
	}
}, false);

const informBundleAvailable = (bundleName) => {
	self.postMessage({
		app: bundleName,
		status: 'on'
	});
}

const informBundleNotAvailable = (bundleName) => {
	self.postMessage({
		app: bundleName,
		status: 'off'
	});
}

const Polls = [];

async function doPoll(app) {
	let result;
	try {
		const healthFile = app.bundle.replace(app.appName + '.js', 'status.js');
		result = await fetch(healthFile);
		if (result.status !== 200 && result.status !== 204) {
			throw new Error('No status file available!');
		}
	} catch {
		result = null;
	}
	if (result) {
		informBundleAvailable(app.appName);
	} else {
		informBundleNotAvailable(app.appName);
	}
}

function startPolling(apps) {
	console.log('Start polling for online sub-apps health check...', apps);
	apps.forEach(app => {
		// very straightforward polling algorithm
		// just try to request app.entry file

		const poll = setInterval(() => doPoll(app), 10 * 1000); // each 10s
		Polls.push({
			bundle: app.bundle,
			handler: poll
		});

		void doPoll(app); // run immediate check
	});
}
