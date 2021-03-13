/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import {Route} from 'react-router-dom';
import {SubAppOnline} from '../system/sub-app-online.component';
import {SubApp} from '../system/sub-app.component';
import {ConfigPage} from './pages/config/config';
import {HomePage} from './pages/home/home';
import {ConfigStore} from './store/config.store';
import {getEnabledSubApps, getSubAppsWithRoutes} from './utils';

export function createRoutePage(appName: string, view: string): (props) => JSX.Element {
	return (props: { location: { pathname: string } }) => {
		// return page wrapper
		console.log('[Render route] for', appName + ':' + view);

		const subApp = getEnabledSubApps().find(a => a.appName === appName);

		ConfigStore.setRoute(props.location.pathname);

		if (subApp.online) {
			return <SubAppOnline appName={appName} subappView={view} className={'app-layout-tc'} silent={true}/>;
		}
		return <SubApp subappView={view} className={'app-layout-tc'} silent={true}/>;
	};
}

export function createRouteStaticPage(title: string, component: JSX.Element): (props) => JSX.Element {
	return (props: { location: { pathname: string } }) => {
		// return page wrapper
		console.log('[Render static route] ', title);
		ConfigStore.setRoute(props.location.pathname);
		return component;
	};
}

function getAppsStaticRoutes(): Array<JSX.Element> {
	const subRoutes: Array<JSX.Element> = [];

	getSubAppsWithRoutes()
		.forEach(subApp => {
				const routes = subApp.routes.map(route => {
					console.log(`[${subApp.appName}] Register sub-app route: "${route.path}", view: "${route.view}"`);

					return <Route
						exact path={'/' + route.path}
						key={route.path}
						render={createRoutePage(subApp.appName, route.view)}/>;
				});
				if (routes.length) {
					routes.forEach(item => subRoutes.push(item));
				}
			}
		);
	return subRoutes;
}

export function getStaticRoutes(): Array<JSX.Element> {
	const AppRoutes = [
		<Route exact path={'/'} key={'home'} render={createRouteStaticPage('Home', <HomePage/>)}/>,

		<Route exact path={'/config'} key={'config'} render={createRouteStaticPage('Config', <ConfigPage/>)}/>
	];

	return [
		...AppRoutes,
		...getAppsStaticRoutes(),
		<Route path={'*'} key={'all'} render={createRouteStaticPage('Home', <HomePage/>)}/>,
	];
}
