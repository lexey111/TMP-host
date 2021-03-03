import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {SubApp} from '../system/sub-app.component';
import {Layout} from './layout';

export const App: React.FC = () => {
	return <Router>
		<div id={'topbar'}>
			<SubApp name={'app-header'}/>
		</div>

		<div id={'activity'}>
			<Layout></Layout>
		</div>
	</Router>;
};
