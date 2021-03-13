/* eslint-disable @typescript-eslint/no-unsafe-assignment,no-nested-ternary,sonarjs/no-duplicate-string */
import * as React from 'react';
import {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {TcIcon, TcSwitch} from 'TMPUILibrary/components';

import {handleStoreValue, observer} from 'TMPUILibrary/mobx';
import {ConfigStore} from '../../store/config.store';
import {TSubApp} from '../../utils';

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
			<thead>
			<tr>
				<th>App Name</th>
				<th>Loaded</th>
				<th>Available</th>
				<th>Size</th>
				<th>Home card</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>{app.appName}</td>
				<td>
					{app.loaded
						? <span style={{color: 'green'}}>Yes <TcIcon type={'check-circle'}/></span>
						: <span style={{color: 'maroon'}}>No <TcIcon type={'caution'} filled={true}/></span>
					}
				</td>
				<td>
					{app.available
						? <span style={{color: 'green'}}>Yes <TcIcon type={'check-circle'}/></span>
						: <span style={{color: 'maroon'}}>No <TcIcon type={'caution'} filled={true}/></span>
					}
				</td>
				<td>{app.fileSize || 'unknown'}</td>
				<td>
					{app.homeCard
						? Array.isArray(app.homeCard)
							? app.homeCard.map(card => appName + '/' + card).join(', ')
							: appName + '/home'
						: <>&mdash;</>
					}
				</td>
			</tr>

			<tr className={'card-details'}>
				<td>Bundle</td>
				<td colSpan={5}>{app.bundle}</td>
			</tr>
			<tr className={'card-details'}>
				<td>Stylesheet</td>
				<td colSpan={5}>{app.stylesheet}</td>
			</tr>

			{!app.online && <tr className={'card-details'}>
				<td>Load path</td>
				<td colSpan={5}>{app.path}</td>
			</tr>}

			{app.routes?.length > 0 && <tr className={'card-details'}>
				<td>Routes</td>
				<td colSpan={5}>
					{app.routes.map(route => {
						return <div key={route.path}>
							<p>
								<Link to={route.path}>/
									{route.spineIcon && <><TcIcon type={route.spineIcon}/>&nbsp;</>}
									{route.path}
								</Link>
								{route.view && <i> &mdash; {route.view}</i>}
							</p>
						</div>;
					})}
				</td>
			</tr>
			}
			</tbody>
		</table>

		<div className={'card-actions'}>
			<div>
				Enabled &nbsp; <TcSwitch size={'small'} onChange={handleEnabledChange} checked={app.enabled}/>
			</div>
			<div>
				Home card &nbsp; <TcSwitch size={'small'} onChange={handleHomeCardChange} checked={app.homeCardEnabled}/>
			</div>
		</div>
	</div>;
});
