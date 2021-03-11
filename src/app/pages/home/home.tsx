/* eslint-disable sonarjs/no-duplicate-string */
import * as React from 'react';
import {useLayoutEffect, useRef, useState} from 'react';
import {SubApp} from '../../../system/sub-app.component';
import {getSubAppsWithHomeCard} from '../../utils';
import {HomePageOffline} from './home-offline';
import './home.less';

declare const IS_COMPOSER: boolean;

let _debouncer;
let firstDelay;

export const HomePage: React.FC = () => {
	const [version, setVersion] = useState(0);
	const [startDelayPassed, setStartDelayPassed] = useState(false);
	const destroying = useRef(false);

	useLayoutEffect(() => {
		firstDelay = setTimeout(() => {
			setStartDelayPassed(true);
		}, 1000);
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
				clearTimeout(firstDelay);

				_debouncer = setTimeout(() => {
					if (!destroying.current) {
						setVersion(v => v + 1); // force render
						setStartDelayPassed(true);
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

	const AppsAvailable = getSubAppsWithHomeCard().filter(app => app.available && app.homeCardEnabled);

	if (!AppsAvailable.length && IS_COMPOSER && startDelayPassed) {
		return <HomePageOffline/>;
	}

	if (!AppsAvailable.length && IS_COMPOSER && !startDelayPassed) {
		return <div className={'app-layout home-page'}>
			Just a second...
		</div>;
	}

	const homeCards: Array<string> = [];
	AppsAvailable.forEach(app => {
		if (app.homeCard === true) {
			homeCards.push(app.appName + '/home');
		}
		if (Array.isArray(app.homeCard)) {
			app.homeCard.forEach(card => {
				homeCards.push(app.appName + '/' + card);
			});
		}
	});

	const triples = [];
	for (let i = 0; i < homeCards.length; i += 3) {
		const c1 = i < homeCards.length ? homeCards[i] : null;
		const c2 = i + 1 < homeCards.length ? homeCards[i + 1] : null;
		const c3 = 2 + 1 < homeCards.length ? homeCards[i + 2] : null;

		triples.push(<div className={'app-home-cards'} key={'triple_' + i.toString()}>
				{c1 && <SubApp
					key={c1}
					subappView={c1}
					className={'app-home-card'}
					silent={true}
				/>
				}
				{c2 && <SubApp
					key={c2}
					subappView={c2}
					className={'app-home-card'}
					silent={true}
				/>
				}
				{c3 && <SubApp
					key={c3}
					subappView={c3}
					className={'app-home-card'}
					silent={true}
				/>
				}
			</div>
		);
	}

	return <div className={'app-layout home-page'} data-version={version}>
		<h1>Welcome to UAC | TMP!</h1>

		{triples}
	</div>;
};
