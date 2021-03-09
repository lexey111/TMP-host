/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-console,@typescript-eslint/restrict-plus-operands */
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {ITmpCore} from 'TMPCore';
import {ITmpManager} from 'TMPCore/index';
import {SubApp} from '../system/sub-app.component';
import {createRoutePage, getStaticRoutes} from './app-routes';
import {getOnlineSubApps, getSubApps, getSubAppsArray} from './utils';

declare global {
	interface Window {
		TmpCore: ITmpCore
		TmpManager: ITmpManager
	}
}

declare const IS_COMPOSER: boolean;
declare const COMPOSER: { url: string; config: string };
const {bus} = window.TmpCore;

let _lastAvailable = false;

function initApp(): void {
	let configFile;

	if (IS_COMPOSER) {
		configFile = COMPOSER.url + '/' + COMPOSER.config;
	}

	const onlineApps = IS_COMPOSER
		? [
			{
				bundle: configFile,
				appName: '@@composer',
				available: false
			}
		]
		: getOnlineSubApps();

	if (onlineApps.length) {
		const worker = new Worker('online-health.js');
		console.log('[Health] Start health check background service' + (IS_COMPOSER ? ' in composer mode' : ''));

		worker.postMessage({
			cmd: 'run',
			apps: onlineApps
		});

		worker.addEventListener('message', (event) => {
			const appName = event.data.app;
			const isAppAvailable = event.data.status === 'on';

			if (appName === '@@composer') {
				bus.broadcast('system.bundleCheck.pulse');
				if (_lastAvailable !== isAppAvailable) {
					console.log('Set common state (composer) to ' + (isAppAvailable ? 'on' : 'off'));
					_lastAvailable = isAppAvailable;
					getSubAppsArray().forEach(app => app.available = isAppAvailable);
					bus.broadcast('system.bundleLoaded');
				}
				return;
			}

			const app = onlineApps.find(a => a.appName === appName);
			if (!app || app.available === isAppAvailable) {
				return;
			}
			app.available = isAppAvailable;
		});
	}
}

function registerSubRoute(
	{
		Routes,
		appName,
		url,
		view
	}: { Routes: Array<JSX.Element>; appName: string; url: string; view: string }): void {

	const newRoute = <Route
		exact path={'/' + url}
		key={url}
		render={createRoutePage(appName, view)}/>;

	Routes.splice(Routes.length - 2, 0, newRoute);
	console.log('[Routes] Add', url + ':' + view);
}

export const App: React.FC = () => {
	const history = useHistory();
	const location = useLocation();

	const APPRoutes = useRef<Array<JSX.Element>>(null);
	const [version, setVersion] = useState(0);

	useEffect(() => {
		initApp();
		APPRoutes.current = getStaticRoutes();
		setVersion(v => v + 1);

		// actualize nav state
		setTimeout(() => {
			bus.broadcast('system.location.changed', location.pathname);
		}, 2000);
	}, []);

	useEffect(() => {
		if (!APPRoutes.current) {
			return;
		}
		bus.broadcast('system.location.changed', location.pathname);
	}, [location.pathname]);

	useEffect(() => {
		// Subscribe to navigation requests and online onLoad events

		bus.observer$.subscribe(value => {
			if (value?.message === 'system.navigate') {
				console.log('[Navigate] Request:', value.data);
				history.push(value.data);
				return;
			}

			if (value?.message === 'system.registerRoutes' && value?.data.appName && Array.isArray(value.data?.routes)) {
				console.log('[Routes] Registration:', value.data);
				const routesToRegister: Array<{ url: string; view: string }> = value.data.routes;

				routesToRegister
					.forEach(routeItem => {
						registerSubRoute({
							Routes: APPRoutes.current,
							appName: value.data.appName,
							url: routeItem.url,
							view: routeItem.view
						});

						if (location.pathname === '/' + routeItem.url) {
							console.log('[Postponed route update]', routeItem.url);
							history.push('/');
							// eslint-disable-next-line @typescript-eslint/no-unsafe-return
							setTimeout(() => history.push(location.pathname), 10);
						}
					});
				return;
			}

			if (value?.message === 'system.bundleLoaded' && value.data) {
				console.log('Online sub-app loaded:', value.data);
				const onlineApp = getSubApps()[value.data];
				if (onlineApp) {
					onlineApp.loaded = true;
				}
			}
		});
	}, []);

	if (!APPRoutes.current) {
		return <div className={'app-resolving'} data-version={version}>Resolving routes...</div>;
	}

	return <>
		<SubApp subappView={'topbar/header'} className={'app-topbar'}/>

		<div className={'activity'}>
			<SubApp subappView={'spine/sidebar'} className={'app-spine'}/>

			<div className={'content-area'}>
				<div className={'content'}>
					<Switch>
						{APPRoutes.current}
					</Switch>
				</div>
			</div>
		</div>
	</>;
};
