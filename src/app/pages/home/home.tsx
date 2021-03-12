/* eslint-disable sonarjs/no-duplicate-string */
import * as React from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {observer} from 'TMPUILibrary/mobx';
import {ConfigStore} from '../../store/config.store';
import {getOnlineSubApps} from '../../utils';
import {HomePageCards} from './home-cards';
import {HomePageOffline} from './home-offline';

import './home.less';

declare const IS_COMPOSER: boolean;

export const HomePage: React.FC = observer(() => {
	const [startDelayPassed, setStartDelayPassed] = useState(false);
	const destroying = useRef(false);

	const firstDelay = useRef<any>();

	useEffect(() => {
		return () => {
			destroying.current = true;
			clearTimeout(firstDelay.current);
		};
	}, []);

	useLayoutEffect(() => {
		if (getOnlineSubApps().length === 0) {
			setStartDelayPassed(true);
			return;
		}

		firstDelay.current = setTimeout(() => {
			setStartDelayPassed(true);
		}, 500);
	}, []);

	if (destroying.current) {
		return null;
	}

	if (!ConfigStore.homeCards.length && IS_COMPOSER && startDelayPassed) {
		return <HomePageOffline/>;
	}

	if (!ConfigStore.homeCards.length && IS_COMPOSER && !startDelayPassed) {
		return <div className={'app-layout home-page'}>
			Just a second...
		</div>;
	}

	return <HomePageCards cards={ConfigStore.homeCards}/>;
});
