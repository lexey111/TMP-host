/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import * as React from 'react';
import {useEffect, useState} from 'react';
import {TcButton, TcIcon} from 'TMPUILibrary/components';
import {reStartApp} from '../main';

declare const COMPOSER: { url: string; config: string };

export const ComposerApp: React.FC = () => {
	const [error, setError] = useState('');
	const [fetching, setFetching] = useState(true);
	const [starting, setStarting] = useState(false);

	useEffect(async () => {
		setFetching(true);
		let result;
		try {
			const configFile = COMPOSER.url + '/' + COMPOSER.config;

			console.log('Requesting Composer config:', configFile);
			const response = await fetch(configFile);

			if (response?.status !== 200 && response?.status !== 204) {
				setError('Unknown error.');
				if (response?.status === 404) {
					setError('404 - Not Found');
				}
			}
			result = await response.json();

			if (!result || Object.keys(result).length === 0) {
				throw new Error('Unknown error.');
			}
			setTimeout(() => {
				setStarting(true);
				// re-define subApps
				window.TmpCore.environment.subAppList = result;
				console.log('Sub-apps', result);
				// pre-process subapps
				Object.keys(window.TmpCore.environment.subAppList).forEach(appCode => {
					const enabled = (localStorage.getItem('tmp.subapp.' + appCode) || 'on') === 'on';
					const homeCardEnabled = (localStorage.getItem('tmp.subapp.homecard' + appCode) || 'on') === 'on';

					window.TmpCore.environment.subAppList[appCode].enabled = enabled;
					window.TmpCore.environment.subAppList[appCode].homeCardEnabled = homeCardEnabled;

					console.log(`  Application bundle "${appCode}": ${enabled ? 'enabled' : 'disabled'}`);
				});

				window.TmpManager.init();
				reStartApp();
			}, 500);
		} catch (e) {
			console.error(e);
			setError(e.message);
			setFetching(false);
		}
		setTimeout(() => {
			setFetching(false);
		}, 500);
	}, []);

	return <div className={'activity'}>
		<div className={'content-area'}>
			<div className={'content'}>
				<div className={'app-layout home-page'}>
					<h1>Setting up the Online Composer</h1>
					{error && <div className={'composer-error'}>
						<h1>{error}</h1>
						<p>
							Cannot get the config from {COMPOSER.url}/{COMPOSER.config}.
						</p>
						<p>
							<TcButton type={'danger'} onClick={() => window.location.reload()}>
								<TcIcon type={'sync'} filled={true}/> Try again
							</TcButton>
						</p>
					</div>
					}
					{fetching && <div className={'composer-fetching'}>
						<h3><TcIcon type={'sync'} spin={true}/> Requesting online configuration</h3>
						<p>{COMPOSER.url}/{COMPOSER.config}</p>
					</div>
					}
					{starting && <div className={'composer-starting'}>
						<h3><TcIcon type={'star'}/> Starting...</h3>
					</div>
					}
				</div>
			</div>
		</div>
	</div>;
};
