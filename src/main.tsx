import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {App} from './app';

import './styles/shell.less';

ReactDOM.render(
	<Router>
		<App/>
	</Router>,
	document.getElementById('shell')
);
