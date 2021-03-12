import {action, computed, makeObservable, observable} from 'TMPUILibrary/mobx';
import {getSubApps, TSubApp, TSubAppList} from '../utils';

function getHomeCards(apps: TSubAppList): Array<string> {
	const subAppsWithHomeCards: Array<TSubApp> = [];

	Object.keys(apps).forEach(key => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (apps[key].enabled && apps[key].available !== false && apps[key].homeCardEnabled) {
			subAppsWithHomeCards.push(apps[key]); // replace with reduce
		}
	});

	const homeCards: Array<string> = [];

	subAppsWithHomeCards.forEach(app => {
		if (app.homeCard === true) {
			homeCards.push(app.appName + '/home');
		}
		if (Array.isArray(app.homeCard)) {
			app.homeCard.forEach(card => {
				homeCards.push(app.appName + '/' + card);
			});
		}
	});
	return homeCards;
}


export class CConfigStore {
	public _changed = false; // add this field to use with handleStoreValue auto-tracking
	public apps = getSubApps(); // object {}

	constructor() {
		makeObservable(this, {
			apps: observable,
			_changed: observable,
			appArray: computed,
			homeCards: computed,

			loadState: action,
			saveState: action,
			recheckOnline: action,
		});
	}

	get appArray(): Array<TSubApp> {
		return Object.keys(this.apps).map(key => this.apps[key]);
	}

	get homeCards(): Array<string> {
		return getHomeCards(this.apps);
	}

	public getApp(appName: string): TSubApp {
		return this.apps[appName];
	}

	public loadState = (): void => {
		Object.keys(this.apps).forEach(key => {
			const app = this.apps[key];

			app.enabled = (localStorage.getItem('tmp.subapp.' + app.appName) || 'on') === 'on';
			app.homeCardEnabled = (localStorage.getItem('tmp.subapp.homecard.' + app.appName) || 'on') === 'on';
		});
	};

	public saveState = (): void => {
		Object.keys(this.apps).forEach(key => {
			const app = this.apps[key];

			localStorage.setItem('tmp.subapp.' + app.appName, app.enabled ? 'on' : 'offoff');
			localStorage.setItem('tmp.subapp.homecard' + app.appName, app.homeCardEnabled ? 'on' : 'off');
		});
	};

	public recheckOnline = (): void => {
		const currentApps = getSubApps();

		if (!this.apps || Object.keys(this.apps).length === 0) {
			this.apps = getSubApps();
		}

		Object.keys(currentApps).forEach(key => {
			this.apps[key].loaded = currentApps[key].loaded;
			this.apps[key].available = currentApps[key].available;
			this.apps[key].fileSize = currentApps[key].fileSize;
		});
	};
}

export const ConfigStore = new CConfigStore();
