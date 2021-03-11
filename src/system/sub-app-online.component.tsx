import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {getEnabledSubApps, TSubApp} from '../app/utils';
import {ErrorOffline} from './errors/error-offline.component';
import {SubApp} from './sub-app.component';

export type TSubAppProps = {
	appName: string
	subappView: string
	className?: string
	silent?: boolean
};

export const SubAppOnline: React.FC<TSubAppProps> = (props: TSubAppProps) => {
	const [version, setVersion] = useState(0);

	const app = useRef<TSubApp>(getEnabledSubApps().find(a => a.appName === props.appName));
	const lastAvailable = useRef<boolean>(app?.current.available);
	const updateTimer = useRef(void 0);

	useEffect(() => {
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;

		const subscription$ = bus.observer$.subscribe(value => {
			if (value?.message !== 'system.bundleLoaded') {
				return;
			}

			if (app.current.available !== lastAvailable.current) {
				lastAvailable.current = app.current.available;

				clearTimeout(updateTimer.current);
				updateTimer.current = setTimeout(() => {
					setVersion(v => v + 1);
				}, 200);
			}
		});

		return () => {
			clearTimeout(updateTimer.current);
			subscription$?.unsubscribe();
		};
	}, []);

	if (!app) {
		return null; // unknown or disabled app
	}

	if (app.current.available === null) {
		return null; // not yet resolved
	}

	if (app.current.available === false && props.silent) {
		return null; // oops, but ok
	}

	if (app.current.available === false && !props.silent) {
		return <ErrorOffline appName={app.current.appName} data-version={version}/>; // oops
	}

	return <SubApp {...props} data-version={version}/>;
};
