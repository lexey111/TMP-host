/* eslint-disable no-console,@typescript-eslint/no-unsafe-assignment,prefer-destructuring,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ITmpManager} from 'TMPCore/index';

export type TSubAppProps = {
	subappView: string
	className?: string
};

let id = 0;

export const SubApp: React.FC<TSubAppProps> = (props: TSubAppProps) => {
	const ref = useRef<HTMLDivElement>();
	const [prepared, setPrepared] = useState(false);

	useEffect(() => {
		// allow to mount only if application is known
		const subappsAvailable = window['TmpCore']['environment']['subAppList'];
		const bundleRequested = (props.subappView || '').split('/')[0];

		setPrepared(Boolean(subappsAvailable[bundleRequested]) && subappsAvailable[bundleRequested].enabled);
	}, []);

	useEffect(() => {
		if (!ref.current || !prepared) {
			return;
		}

		const TmpManager: ITmpManager = window['TmpManager'];
		const currentId = ref.current.id;

		TmpManager
			.mount(props.subappView, currentId)
			.catch(err => {
				console.log('Error on mounting', props.subappView);
				console.log(err);
			});

		return () => {
			TmpManager.unmount(props.subappView, currentId);
		};
	}, [ref, prepared]);

	if (!prepared) {
		return null;
	}

	return <div
		ref={ref}
		id={'tmp-container-' + (id++).toString()}
		className={'tmp-subapp-view' + (props.className ? ' ' + props.className : '')}>
	</div>;
};
