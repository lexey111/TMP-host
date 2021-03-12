/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
import * as React from 'react';
import {useCallback} from 'react';
import {TcButton} from 'TMPUILibrary/components';
import {observer} from 'TMPUILibrary/mobx';
import {ConfigStore} from '../../store/config.store';
import {ApplicationCard} from './application-card.component';

export const ConfigPage: React.FC = observer(() => {

	const handleApply = useCallback(() => {
		ConfigStore.saveState();
		window.location.href = '/';
	}, []);

	return <div className={'app-layout app-single-page'}>
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
