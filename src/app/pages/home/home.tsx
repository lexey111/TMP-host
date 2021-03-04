import * as React from 'react';
import {SubApp} from '../../../system/sub-app.component';

import './home.less';

const availableSubApps = window.TmpCore.environment.subAppList;
const visibleSubApps = [];

Object.keys(availableSubApps).forEach(key => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (availableSubApps[key].enabled) {
		visibleSubApps.push(availableSubApps[key]); // replace with reduce
	}
});

export const HomePage: React.FC = () => {
	return <div className={'app-layout home-page'}>
		<h1>Welcome to UAC | TMP!</h1>

		<div className={'app-home-cards'}>
			{visibleSubApps.map((app: { appName: string }) => {
				return <SubApp
					subappView={app.appName + '/home'}
					className={'app-home-card'}
					silent={true}
					key={app.appName}/>;
			})}
		</div>

	</div>;
};
