/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-console,@typescript-eslint/restrict-plus-operands,sonarjs/no-duplicate-string */
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Switch, useHistory, useLocation} from 'react-router-dom';
import {ITmpCore} from 'TMPCore';
import {ITmpManager} from 'TMPCore/index';

import {observer} from 'TMPUILibrary/mobx';
import {Breadcrumbs} from '../system/breadcrumbs/breadcrumbs.component';
import {SubAppOnline} from '../system/sub-app-online.component';
import {SubApp} from '../system/sub-app.component';
import {getStaticRoutes} from './app-routes';
import {ConfigStore} from './store/config.store';
import {getOnlineSubApps, getSubApps, getSubAppsArray, TSubApp} from './utils';

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
		const worker = new Worker('/online-health.js');
		console.log('[HEALTH] Start health check background service' + (IS_COMPOSER ? ' in composer mode' : ''));

		worker.postMessage({
			cmd: 'run',
			apps: onlineApps
		});

		worker.addEventListener('message', (event) => {
			const appName = event.data.app;
			const isAppAvailable = event.data.status === 'on';

			bus.broadcast('system.bundleCheck.pulse');

			if (appName === '@@composer') {
				if (_lastAvailable !== isAppAvailable) {
					console.log('[HEALTH] Set common state (composer) to ' + (isAppAvailable ? 'on' : 'off'));
					_lastAvailable = isAppAvailable;
					getSubAppsArray().forEach(app => app.available = isAppAvailable);
					bus.broadcast('system.bundleLoaded');

					ConfigStore.recheckOnline();
				}
				return;
			}

			const app = (onlineApps as Array<TSubApp>).find(a => a.appName === appName);
			if (!app || app.available === isAppAvailable) {
				return;
			}

			console.log(`[HEALTH] Online sub-app ${app.appName} is ${isAppAvailable ? 'available' : 'off'}`);

			app.available = isAppAvailable;
			bus.broadcast('system.bundleLoaded');

			ConfigStore.recheckOnline();
		});
	}
}

export const App: React.FC = observer(() => {
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

			if (value?.message === 'system.bundleLoaded' && value.data) {
				console.log('Sub-app loaded:', value.data);
				const onlineApp = getSubApps()[value.data];
				if (onlineApp) {
					onlineApp.loaded = true;
				}
				ConfigStore.recheckOnline();
			}
		});
	}, []);

	if (!APPRoutes.current) {
		return <div className={'app-resolving'} data-version={version}>Resolving routes...</div>;
	}

	return <>
		{IS_COMPOSER
			? <SubAppOnline subappView={'topbar/header'} appName={'topbar'} className={'app-topbar'} silent={true}/>
			: <SubApp subappView={'topbar/header'} className={'app-topbar'}/>
		}

		<div className={'activity'}>
			{IS_COMPOSER
				? <SubAppOnline subappView={'spine/sidebar'} appName={'spine'} className={'app-spine'} silent={true}/>
				: <SubApp subappView={'spine/sidebar'} className={'app-spine'}/>
			}

			<div className={'content-area'}>
				<Breadcrumbs />
				<div className={'content'}>
					<Switch>
						{APPRoutes.current}
					</Switch>
				</div>
			</div>
		</div>
	</>;
});
