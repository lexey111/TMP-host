/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import {TcCard, TcIcon, TcSwitch} from 'TMPUILibrary/components';
import {getSubApps, TSubApp} from '../../utils';

type TApplicationCardProps = {
	appCode: string
};

export const ApplicationCard: React.FC<TApplicationCardProps> = ({appCode}: TApplicationCardProps) => {
	const app: TSubApp = getSubApps()[appCode];

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
				{app.online && <tr>
					<td>Loaded</td>
					<td>
						{app.loaded
							? <span style={{color: 'green'}}>Yes <TcIcon type={'check'}/></span>
							: <span style={{color: 'maroon'}}>No <TcIcon type={'close'}/></span>
						}
					</td>
				</tr>}
				{app.online && <tr>
					<td>Available</td>
					<td>
						{app.available
							? <span style={{color: 'green'}}>Yes <TcIcon type={'check'}/></span>
							: <span style={{color: 'maroon'}}>No <TcIcon type={'close'}/></span>
						}
					</td>
				</tr>}
				{app.routes?.length > 0 &&
				<tr>
					<td>Routes</td>
					<td>
						{app.routes.map(route => {
							return <div key={route.path}>
								<p>
									<Link to={route.path}>/
										{route.spineIcon && <><TcIcon type={route.spineIcon}/>&nbsp;</>}
										{route.path}
									</Link>
								</p>
								<p>
									View: {route.view}
								</p>
							</div>;
						})}
					</td>
				</tr>
				}
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
