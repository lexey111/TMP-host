import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {LipsumPara} from 'TMPUILibrary/ui-elements';

import './home.less';

export const HomePage: React.FC = () => {
	return <div className={'app-layout'}>
		<TcViewTitle>
			Home page
		</TcViewTitle>

		<TcSmartLayout navigationMode={'scroll'}>
			<LipsumPara paragraphs={14} words={50}/>
		</TcSmartLayout>
	</div>;
};
