import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Layout} from './layout';

export const App: React.FC = () => {
	return <Router>
		<div id={'activity'}>
			<Layout></Layout>
		</div>
	</Router>;
};
