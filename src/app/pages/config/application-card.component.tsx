/* eslint-disable @typescript-eslint/no-unsafe-assignment,no-nested-ternary */
import * as React from 'react';
import {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {TcIcon, TcSwitch} from 'TMPUILibrary/components';

import {handleStoreValue, observer} from 'TMPUILibrary/mobx';
import {TSubApp} from '../../utils';
import {ConfigStore} from '../../store/config.store';

type TApplicationCardProps = {
	appName: string
};

export const ApplicationCard: React.FC<TApplicationCardProps> = observer(({appName}: TApplicationCardProps) => {
	const app: TSubApp = ConfigStore.getApp(appName);

	const handleEnabledChange = useCallback((val: boolean) => {
		handleStoreValue(ConfigStore, 'apps.' + appName + '.enabled', val);
	}, []);

	const handleHomeCardChange = useCallback((val: boolean) => {
		handleStoreValue(ConfigStore, 'apps.' + appName + '.homeCardEnabled', val);
	}, []);

	return <div className={'application-card' + (app.enabled ? ' enabled' : ' disabled') + (app.available ? '' : ' offline')}>
		<h1>{app.title}</h1>
		<table>
			<tbody>
			<tr>
				<td>App name</td>
				<td>{app.appName}</td>
			</tr>
			<tr>
				<td>Bundle</td>
				<td>{app.bundle}</td>
			</tr>
			<tr>
				<td>Stylesheet</td>
				<td>{app.stylesheet}</td>
			</tr>

			{!app.online && <tr>
				<td>Load path</td>
				<td>{app.path}</td>
			</tr>}

			{app.online && <>
				<tr>
					<td>Loaded</td>
					<td>
						{app.loaded
							? <span style={{color: 'green'}}>Yes <TcIcon type={'check-circle'}/></span>
							: <span style={{color: 'maroon'}}>No <TcIcon type={'caution'} filled={true}/></span>
						}
					</td>
				</tr>

				<tr>
					<td>Available</td>
					<td>
						{app.available
							? <span style={{color: 'green'}}>Yes <TcIcon type={'check-circle'}/></span>
							: <span style={{color: 'maroon'}}>No <TcIcon type={'caution'} filled={true}/></span>
						}
					</td>
				</tr>
			</>}

			<tr>
				<td>File size</td>
				<td>{app.fileSize || 'unknown'}</td>
			</tr>

			<tr>
				<td>Home card{Array.isArray(app.homeCard) ? 's' : ''}</td>
				<td>
					{app.homeCard
						? Array.isArray(app.homeCard)
							? app.homeCard.map(card => appName + '/' + card).join(', ')
							: 'yes'
						: 'no'
					}
				</td>
			</tr>

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

		<div className={'actions'}>
			<div>
				Enabled &nbsp; <TcSwitch size={'small'} onChange={handleEnabledChange} checked={app.enabled}/>
			</div>
			<div>
				Home card &nbsp; <TcSwitch size={'small'} onChange={handleHomeCardChange} checked={app.homeCardEnabled}/>
			</div>
		</div>
	</div>;
});
