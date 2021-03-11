import * as React from 'react';
import {useEffect, useState} from 'react';
import {getActiveSubApps} from '../app/utils';
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

	const app = getActiveSubApps().find(a => a.appName === props.appName);

	useEffect(() => {
		// subscribe to online sub-app loaded event
		const {bus} = window.TmpCore;

		const subscription$ = bus.observer$.subscribe(value => {
			if (value?.message === 'system.bundleLoaded') {
				setTimeout(() => {
					setVersion(v => v + 1);
				}, 200);
			}
		});

		return () => {
			subscription$?.unsubscribe();
		};
	}, []);

	if (!app) {
		return null; // unknown or disabled app
	}

	if (app.available === null) {
		return null; // not yet resolved
	}

	if (app.available === false && props.silent) {
		return null; // oops, but ok
	}

	if (app.available === false && !props.silent) {
		return <ErrorOffline appName={app.appName} data-version={version}/>; // oops
	}

	return <SubApp {...props} data-verisoon={version}/>;
};
