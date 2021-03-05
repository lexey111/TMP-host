/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-console,@typescript-eslint/restrict-plus-operands */
import * as React from 'react';
import {useEffect} from 'react';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {ITmpCore} from 'TMPCore';
import {SubApp} from '../system/sub-app.component';
import AppRoutes, {createRoutePage} from './app-routes';
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

	worker.addEventListener('message', (event) => {
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
	const location = useLocation();

	useEffect(() => {
		// Subscribe to navigation requests and online onLoad events
		const {bus} = window.TmpCore;

		bus.observer$.subscribe(value => {
			if (value?.message === 'system.navigate') {
				console.log('Navigate request:', value.data);
				history.push(value.data);
			}

			if (value?.message === 'system.registerRoute') {
				console.log('[Route] Registration:', value.data);

				const newRoute = <Route
					exact path={'/' + value.data.url}
					key={value.data.url}
					render={createRoutePage(value.data.appName, value.data.view)}/>;

				AppRoutes.splice(AppRoutes.length - 2, 0, newRoute);

				if (location.pathname === '/' + value.data.url) {
					// postponed route update
					history.push('/');
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					setTimeout(() => history.push(location.pathname), 10);
				}
			}

			if (value?.message === 'system.onlineReady' && value.data) {
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
