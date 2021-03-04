import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {LipsumPara} from 'TMPUILibrary/ui-elements';

import './config.less';

export const ConfigPage: React.FC = () => {
	return <>
		<TcViewTitle>
			Configuration
		</TcViewTitle>

		<TcSmartLayout navigationMode={'scroll'}>
			<LipsumPara paragraphs={4} words={50}/>
		</TcSmartLayout>
	</>;
};
