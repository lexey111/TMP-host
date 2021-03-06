import {action, computed, makeObservable, observable} from 'TMPUILibrary/mobx';
import {getSubApps, TSubApp} from '../../utils';

export class CConfigStore {
	public _changed = false; // add this field to use with handleStoreValue auto-tracking
	public apps = getSubApps(); // object {}

	constructor() {
		makeObservable(this, {
			apps: observable,
			_changed: observable,
			appArray: computed,

			loadState: action,
			saveState: action,
			recheckOnline: action,
		});
	}

	get appArray(): Array<TSubApp> {
		return Object.keys(this.apps).map(key => this.apps[key]);
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
		Object.keys(currentApps).forEach(key => {
			this.apps[key].loaded = currentApps[key].loaded;
			this.apps[key].available = currentApps[key].available;
		});
	};
}

export const ConfigStore = new CConfigStore();
