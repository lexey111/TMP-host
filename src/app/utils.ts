export type TSubAppRoute = {
	path: string
	view: string
	title?: string
	spineIcon?: string
	spineTitle?: string
	position?: 'top' | 'bottom'
};

export type TSubApp = {
	online?: boolean // is "online" app
	loaded?: boolean // bundle was loaded
	available?: true | false | null // online bundle is available right now
	enabled?: boolean // app is allowed to be loaded
	fileSize?: string
	homeCardEnabled?: boolean // app is allowed to be shown home card
	appName: string
	title: string
	bundle: string
	path: string
	stylesheet: string
	homeCard?: boolean | Array<string>
	routes?: Array<TSubAppRoute>
};

export type TSubAppList = Record<string, TSubApp>;

export const getSubApps = (): TSubAppList => {
	return window.TmpCore.environment.subAppList as unknown as TSubAppList;
};

export const getSubAppsArray = (): Array<TSubApp> => {
	const subApps = getSubApps();
	return Object.keys(subApps).map(key => subApps[key]);
};

export const getEnabledSubApps = (): Array<TSubApp> => {
	const availableSubApps = getSubApps();
	const activeSubApps: Array<TSubApp> = [];

	Object.keys(availableSubApps).forEach(key => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (availableSubApps[key].enabled) {
			activeSubApps.push(availableSubApps[key]); // replace with reduce
		}
	});

	return activeSubApps;
};

export const getSubAppsWithHomeCard = (): Array<TSubApp> => {
	return getEnabledSubApps().filter(app => app.homeCard);
};

export const getSubAppsWithRoutes = (): Array<TSubApp> => {
	return getEnabledSubApps().filter(app => app.routes?.length > 0);
};

export const getOnlineSubApps = (): Array<TSubApp> => {
	return getEnabledSubApps().filter(app => app.online);
};
