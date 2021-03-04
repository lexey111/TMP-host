/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {TcNavAnchor} from 'TMPUILibrary/navigation';
import {ApplicationCard} from './application-card.component';

const availableSubApps = window.TmpCore.environment.subAppList;

export const ConfigPage: React.FC = () => {
	return <div className={'app-layout-tc'}>
		<TcViewTitle>
			Configuration
		</TcViewTitle>

		<TcSmartLayout navigationMode={'scroll'}>
			<TcNavAnchor>Available applications</TcNavAnchor>

			<div className={'application-cards '}>
				{Object.keys(availableSubApps).map(appCode => <ApplicationCard appCode={appCode} key={appCode}/>)}
			</div>

			<p>
				<i>Note:</i> you need to refresh page to apply changes.
			</p>
		</TcSmartLayout>
	</div>;
};
