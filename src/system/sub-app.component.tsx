/* eslint-disable no-console,@typescript-eslint/no-unsafe-assignment,prefer-destructuring,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import {useLayoutEffect, useRef, useState} from 'react';
import {ITmpManager} from 'TMPCore/index';

export type TSubAppProps = {
	subappView: string
	className?: string
	silent?: boolean
};

let id = 1;

export const SubApp: React.FC<TSubAppProps> = (props: TSubAppProps) => {
	const ref = useRef<HTMLDivElement>();
	const destroying = useRef(false);
	const [prepared, setPrepared] = useState(false);
	const mountId = useRef('');
	const mountedId = useRef('');

	useLayoutEffect(() => {
		return () => {
			destroying.current = true;
		};
	}, []);

	useLayoutEffect(() => {
		return () => {
			if (mountedId.current) {
				const TmpManager: ITmpManager = window['TmpManager'];
				try {
					TmpManager.unmount(props.subappView, mountedId.current);
				} catch (e) {
					//
				}
			}
		};
	}, []);

	useLayoutEffect(() => {
		if (destroying.current) {
			return;
		}
		// allow to mount only if application is known and enabled
		const subappsAvailable = window['TmpCore']['environment']['subAppList'];
		const bundleRequested = (props.subappView || '').split('/')[0];

		if (!(Boolean(subappsAvailable[bundleRequested]) && subappsAvailable[bundleRequested].enabled)) {
			return;
		}

		mountId.current = 'tmp-container-' + (id++).toString();

		// asynchronous rendering
		setTimeout(() => {
			if (destroying.current) {
				return;
			}
			setPrepared(true);
		}, 20);
	}, []);

	useLayoutEffect(() => {
		if (!ref.current || !prepared || destroying.current || mountedId.current) {
			return;
		}

		const TmpManager: ITmpManager = window['TmpManager'];

		try {
			TmpManager
				.mount(props.subappView, mountId.current)
				.then(() => {
					mountedId.current = mountId.current;
					return void 0;
				})
				.catch(err => {
					if (props.silent !== true) {
						console.log('Error on mounting', props.subappView);
						console.log(err);
					} else {
						setPrepared(false);
					}
				});
		} catch {
			//
		}
	}, [ref, prepared]);

	if (!prepared) {
		return null;
	}

	return <div
		ref={ref}
		id={mountId.current}
		className={'tmp-subapp-view' + (props.className ? ' ' + props.className : '')}>
	</div>;
};
