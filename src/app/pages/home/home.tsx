import * as React from 'react';
import {useEffect, useState} from 'react';
import {SubApp} from '../../../system/sub-app.component';
import {getSubAppsWithHomeCard} from '../../utils';

import './home.less';

export const HomePage: React.FC = () => {
	const [version, setVersion] = useState(0);

	useEffect(() => {
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;
		bus.observer$.subscribe(value => {
			if (value?.message === 'system.bundleLoaded') {
				setTimeout(() => {
					setVersion(v => v + 1);
				}, 500);
			}
		});

	}, []);

	return <div className={'app-layout home-page'} data-version={version}>
		<h1>Welcome to UAC | TMP!</h1>

		<div className={'app-home-cards'}>
			{getSubAppsWithHomeCard()
				.filter(app => app.available && app.homeCardEnabled)
				.map(app => {

					console.log('Requested home card from sub-app', app.appName);

					return <SubApp
						subappView={app.appName + '/home'}
						className={'app-home-card'}
						silent={true}
						key={app.appName}/>;
				})}
		</div>
	</div>;
};
