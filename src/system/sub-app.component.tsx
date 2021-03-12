/* eslint-disable no-console,@typescript-eslint/no-unsafe-assignment,prefer-destructuring,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import * as React from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ITmpManager} from 'TMPCore/index';
import {observer} from 'TMPUILibrary/mobx';
import {ConfigStore} from '../app/store/config.store';

export type TSubAppProps = {
	subappView: string
	className?: string
	silent?: boolean
};

const uniqId = (): string => {
	return '_' + Math.random().toString(36).substr(2, 9);
};

export const SubApp: React.FC<TSubAppProps> = observer((props: TSubAppProps) => {
	const destroying = useRef(false);
	const [bundle] = useState<string>((props.subappView || '').split('/')[0]);
	const mountId = useRef<string>('_ms_' + bundle + '_' + uniqId()); // container id
	const mountedWithId = useRef(''); // successfully mounted container id

	const bundleIsAvailable = ConfigStore.getApp(bundle)?.available;

	useEffect(() => {
		return () => {
			destroying.current = true;
			try {
				const el = document.getElementById(mountedWithId.current);
				if (el) {
					const TmpManager: ITmpManager = window['TmpManager'];
					TmpManager.unmount(props.subappView, mountedWithId.current);
				}
			} catch (e) {
				//
			}
		};
	}, []);

	useLayoutEffect(() => {
		if (destroying.current || mountedWithId.current || !bundleIsAvailable) {
			return;
		}

		const TmpManager: ITmpManager = window['TmpManager'];

		try {
			const el = document.getElementById(mountId.current);
			if (!el) {
				console.log('No element to mount:', mountId.current);
				return;
			}

			TmpManager
				.mount(props.subappView, mountId.current)
				.then(() => {
					mountedWithId.current = mountId.current;
					return void 0;
				})
				.catch(err => {
					if (props.silent !== true) {
						console.log('Error on mounting', props.subappView);
						console.log(err);
					}
				});
		} catch {
			//
		}
	}, [bundleIsAvailable]);

	const app = ConfigStore.getApp(bundle);

	if (!app.available) {
		return null;
	}

	return <div
		id={mountId.current}
		className={'tmp-subapp-view' + (props.className ? ' ' + props.className : '')}>
	</div>;
});
