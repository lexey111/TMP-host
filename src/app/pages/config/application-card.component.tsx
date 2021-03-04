/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import {useCallback, useState} from 'react';
import {TcCard, TcSwitch} from 'TMPUILibrary/components';

type TApplicationCardProps = {
	appCode: string
};

const availableSubApps = window.TmpCore.environment.subAppList;

export const ApplicationCard: React.FC<TApplicationCardProps> = ({appCode}: TApplicationCardProps) => {
	const app: { appName: string; title: string; bundle: string; path: string; stylesheet: string } = availableSubApps[appCode];
	const [checked, setChecked] = useState<boolean>((localStorage.getItem('tmp.subapp.' + app.appName) || 'on') === 'on');

	const onChange = useCallback((isChecked: boolean) => {
		localStorage.setItem('tmp.subapp.' + app.appName, isChecked ? 'on' : 'off');
		setChecked(isChecked);
	}, []);

	return <div className={'application-card'}>
		<TcCard title={app.title}>
			<table>
				<tbody>
				<tr>
					<td>Code</td>
					<td>{app.appName}</td>
				</tr>
				<tr>
					<td>Bundle file</td>
					<td>{app.bundle}</td>
				</tr>
				<tr>
					<td>Stylesheet file</td>
					<td>{app.stylesheet}</td>
				</tr>
				<tr>
					<td>Load path</td>
					<td>{app.path}</td>
				</tr>
				</tbody>
			</table>
			<p>&nbsp;</p>
			<div>
				<p>
					Enabled: <TcSwitch size={'small'} onChange={onChange} checked={checked}/>
				</p>
			</div>
		</TcCard>
	</div>;
};
