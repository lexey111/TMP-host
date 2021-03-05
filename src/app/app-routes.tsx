import * as React from 'react';
import {Route} from 'react-router-dom';
import {SubAppOnline} from '../system/sub-app-online.component';
import {SubApp} from '../system/sub-app.component';
import {ConfigPage} from './pages/config/config';
import {HomePage} from './pages/home/home';
import {getActiveSubApps, getSubAppsWithRoutes} from './utils';

export function createRoutePage(appName: string, view: string): () => JSX.Element {
	return function renderRoute() {
		// return page wrapper
		console.log('[Render route] for', appName + ':' + view);

		const subApp = getActiveSubApps().find(a => a.appName === appName);

		if (subApp.online) {
			return <SubAppOnline bundle={appName} subappView={view} className={'app-layout-tc'} silent={true}/>;
		}
		return <SubApp subappView={view} className={'app-layout-tc'} silent={true}/>;
	};
}

const AppRoutes = [
	<Route exact path={'/config'} key={'config'}>
		<ConfigPage/>
	</Route>,
];

getSubAppsWithRoutes()
	.forEach(subApp => {
			const routes = subApp.routes.map(route => {
				console.log(`[${subApp.appName}] Register route: "${route.path}", view: "${route.view}"`);

				return <Route
					exact path={'/' + route.path}
					key={route.path}
					render={createRoutePage(subApp.appName, route.view)}/>;
			});
			if (routes.length) {
				routes.forEach(item => AppRoutes.push(item));
			}
		}
	);

AppRoutes.splice(0, 0, <Route exact path={'/'} key={'home'}>
		<HomePage/>
	</Route>
); // must be the first one

AppRoutes.push(<Route path={'*'} key={'home'}>
		<HomePage/>
	</Route>
); // must be the last one

export default AppRoutes;
