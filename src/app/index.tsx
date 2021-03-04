/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import {useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import {ITmpCore} from 'TMPCore';

import {SubApp} from '../system/sub-app.component';
import {ConfigPage} from './pages/config/config';
import {HomePage} from './pages/home/home';

declare global {
	interface Window {
		TmpCore: ITmpCore
	}
}
const {bus} = window.TmpCore;

export const App: React.FC = () => {
	const history = useHistory();

	useEffect(() => {
		bus.observer$.subscribe(value => {
			if (value.message === 'system.navigate') {
				// eslint-disable-next-line no-console
				console.log('Navigate request:', value.data);
				history.push(value.data);
			}
		});
	}, []);

	return <>
		<SubApp subappView={'topbar/header'} className={'app-topbar'}/>

		<div className={'activity'}>
			<SubApp subappView={'spine/sidebar'} className={'app-spine'}/>

			<div className={'content-area'}>
				<div className={'content'}>
					<Switch>
						<Route path={'/config'}>
							<ConfigPage/>
						</Route>
						<Route path={'/'}>
							<HomePage/>
						</Route>
					</Switch>
				</div>
			</div>
		</div>
	</>;
};
