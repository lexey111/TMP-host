import * as React from 'react';
import {TcSmartLayout, TcViewTitle} from 'TMPUILibrary/layout';
import {TcNavAnchor} from 'TMPUILibrary/navigation';
import {LipsumPara} from 'TMPUILibrary/ui-elements';

export const Layout: React.FC = () => {
	return <div id={'layout'}>
		<TcViewTitle>
			This is the Title
		</TcViewTitle>

		<TcSmartLayout navigationMode={'scroll'}>
			<TcNavAnchor>Overview</TcNavAnchor>
			<LipsumPara paragraphs={8} words={50}/>

			<TcNavAnchor>Stage 1</TcNavAnchor>
			<LipsumPara paragraphs={7} words={50}/>

			<TcNavAnchor>Stage 2</TcNavAnchor>
			<LipsumPara paragraphs={6} words={50}/>

			<TcNavAnchor>Stage 3</TcNavAnchor>
			<LipsumPara paragraphs={7} words={50}/>

			<TcNavAnchor>About</TcNavAnchor>
			<LipsumPara paragraphs={4} words={50}/>
		</TcSmartLayout>
	</div>;
};
