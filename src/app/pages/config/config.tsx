/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {TcButton} from 'TMPUILibrary/components';
import {observer} from 'TMPUILibrary/mobx';
import {ApplicationCard} from './application-card.component';
import {ConfigStore} from './config.store';

let _debouncer;
export const ConfigPage: React.FC = observer(() => {
	const [version, setVersion] = useState(0);

	useEffect(() => {
		ConfigStore.recheckOnline();
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;
		const subscriber$ = bus.observer$.subscribe(value => {
			if (value?.message === 'system.bundleLoaded') {
				clearTimeout(_debouncer);
				_debouncer = setTimeout(() => {
					setVersion(v => v + 1);
					ConfigStore.recheckOnline();
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

	const handleApply = useCallback(() => {
		ConfigStore.saveState();
		window.location.href = '/';
	}, []);

	return <div className={'app-layout app-single-page'} data-version={version}>
		<div className={'app-single-page-content'}>
			<h1>Available applications</h1>

			<div className={'application-cards '}>
				{ConfigStore.appArray.map(app => <ApplicationCard appName={app.appName} key={app.appName}/>)}
			</div>
		</div>
		<div className={'app-single-page-actions'}>
			<TcButton
				onClick={handleApply}
				disabled={!ConfigStore._changed}>
				Apply changes
			</TcButton>
			{!ConfigStore._changed && <span style={{marginLeft: '1em'}}>Change some value first</span>}
		</div>
	</div>;
});
