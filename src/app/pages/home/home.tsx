/* eslint-disable sonarjs/no-duplicate-string */
import * as React from 'react';
import {useLayoutEffect, useRef, useState} from 'react';
import {SubApp} from '../../../system/sub-app.component';
import {getSubAppsWithHomeCard} from '../../utils';

import './home.less';

let _debouncer;
export const HomePage: React.FC = () => {
	const [version, setVersion] = useState(0);
	const destroying = useRef(false);

	useLayoutEffect(() => {
		return () => {
			destroying.current = true;
		};
	}, []);

	useLayoutEffect(() => {
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;
		const subscriber$ = bus.observer$.subscribe(value => {
			if (value?.message === 'system.bundleLoaded') {
				clearTimeout(_debouncer);
				_debouncer = setTimeout(() => {
					if (!destroying.current) {
						setVersion(v => v + 1); // force render
					}
				}, 500);
			}
		});

		return () => {
			clearTimeout(_debouncer);
			if (subscriber$) {
				subscriber$.unsubscribe();
			}
		};
	}, []);

	if (destroying.current) {
		return null;
	}

	return <div className={'app-layout home-page'} data-version={version}>
		<h1>Welcome to UAC | TMP!</h1>

		<div className={'app-home-cards'}>
			{getSubAppsWithHomeCard()
				.filter(app => app.available && app.homeCardEnabled)
				.map(app => {

					console.log('Requested home card(s) from sub-app', app.appName);

					if (typeof app.homeCard === 'boolean') {
						console.log('  - single card');
						return <SubApp
							subappView={app.appName + '/home'}
							className={'app-home-card'}
							silent={true}
							key={app.appName}/>;
					}

					console.log('  - multiple cards,', app.homeCard.join(', '));
					return <>
						{app.homeCard.map(cardName => <SubApp
							subappView={app.appName + '/' + cardName}
							className={'app-home-card'}
							silent={true}
							key={app.appName + '_' + cardName}/>)}
					</>;
				})}
		</div>
	</div>;
};
