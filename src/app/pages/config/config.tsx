/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {useEffect, useState} from 'react';
import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {TcNavAnchor} from 'TMPUILibrary/navigation';
import {getSubApps} from '../../utils';
import {ApplicationCard} from './application-card.component';

export const ConfigPage: React.FC = () => {
	const [version, setVersion] = useState(0);

	useEffect(() => {
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;
		bus.observer$.subscribe(value => {
			if (value?.message === 'system.onlineReady') {
				setTimeout(() => {
					setVersion(v => v + 1);
				}, 500);
			}
		});
	}, []);

	return <div className={'app-layout-tc'} data-version={version}>
		<TcViewTitle>
			Configuration
		</TcViewTitle>

		<TcSmartLayout navigationMode={'scroll'}>
			<TcNavAnchor>Available applications</TcNavAnchor>

			<div className={'application-cards '}>
				{Object.keys(getSubApps()).map(appCode => <ApplicationCard appCode={appCode} key={appCode}/>)}
			</div>

			<p>
				<i>Note:</i> you need to refresh page to apply changes.
			</p>
		</TcSmartLayout>
	</div>;
};
