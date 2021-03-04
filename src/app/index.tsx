import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {SubApp} from '../system/sub-app.component';
import {Layout} from './layout';

export const App: React.FC = () => {
	return <Router>
		<SubApp subappView={'topbar/header'} className={'app-topbar'}/>

		<div id={'activity'}>
			<SubApp subappView={'sidebar/spine'} className={'app-spine'}/>

			<div id={'content'}>
				<Layout></Layout>
			</div>
		</div>
	</Router>;
};
