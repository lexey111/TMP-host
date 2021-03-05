/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import {useEffect} from 'react';
import {Switch, useHistory} from 'react-router-dom';
import {ITmpCore} from 'TMPCore';

import {SubApp} from '../system/sub-app.component';
import AppRoutes from './app-routes';
import {getSubApps, getSubAppsWithRoutes} from './utils';

declare global {
	interface Window {
		TmpCore: ITmpCore
	}
}

const onlineApps = getSubAppsWithRoutes().filter(app => app.online);

if (onlineApps.length) {
	const worker = new Worker('online-health.js');
	console.log('Start health check background service');

	worker.postMessage({
		cmd: 'run',
		apps: onlineApps
	});

	worker.addEventListener('message', function (event) {
		// `event.data` contains the value or object sent from the worker
		const appName = event.data.app;
		const isAppAvailable = event.data.status === 'on';

		const app = onlineApps.find(a => a.appName === appName);
		if (!app || app.available === isAppAvailable) {
			return;
		}
		app.available = isAppAvailable;
		const {bus} = window.TmpCore;
		bus.broadcast('system.onlineReady');
	});
}


export const App: React.FC = () => {
	const history = useHistory();

	useEffect(() => {
		// Subscribe to navigation requests and online onLoad events
		const {bus} = window.TmpCore;

		bus.observer$.subscribe(value => {
			if (value?.message === 'system.navigate') {
				// eslint-disable-next-line no-console
				console.log('Navigate request:', value.data);
				history.push(value.data);
			}

			if (value?.message === 'system.onlineReady' && value.data) {
				// eslint-disable-next-line no-console
				console.log('Online sub-app loaded:', value.data);
				const onlineApp = getSubApps()[value.data];
				if (onlineApp) {
					onlineApp.loaded = true;
				}
			}
		});
	}, []);

	return <>
		<SubApp subappView={'topbar/header'} className={'app-topbar'}/>

		<div className={'activity'}>
			<SubApp subappView={'spine/sidebar'} className={'app-spine'}/>

			<div className={'content-area'}>
				<div className={'content'}>
					<Switch>
						{AppRoutes}
					</Switch>
				</div>
			</div>
		</div>
	</>;
};
