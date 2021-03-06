/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return */
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {TcButton, TcIcon} from 'TMPUILibrary/components';
import {getSubApps} from '../../app/utils';

type TErrorOfflineProps = {
	appName: string
};

export const ErrorOffline: React.FC<TErrorOfflineProps> = (props: TErrorOfflineProps) => {
	const app = getSubApps()[props.appName];
	const history = useHistory();

	return <div className={'app-layout error-page'}>
		<div className={'error-content'}>
			<h1><TcIcon type={'caution'} filled/> Oops!</h1>

			<p>
				Looks like online application <b>"{app ? app.title : props.appName}"</b> you're looking for is now offline.
			</p>

			<div className={'error-application-card'}>
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
									<p>/
										{route.spineIcon && <><TcIcon type={route.spineIcon}/>&nbsp;</>}
										{route.path}
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
				<div className={'action-line'}>
					<TcButton
						type={'ghost-danger'}
						onClick={() => history.push('/')}>
						<TcIcon type={'arrow-left'}/> Home page
					</TcButton>
				</div>
			</div>
		</div>
	</div>;
};
