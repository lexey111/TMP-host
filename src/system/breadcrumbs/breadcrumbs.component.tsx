import * as React from 'react';
import {Link} from 'react-router-dom';
import {observer} from 'TMPUILibrary/mobx';
import {ConfigStore} from '../../app/store/config.store';
import {getSubAppsWithRoutes} from '../../app/utils';

export const Breadcrumbs: React.FC = observer(() => {
	const locationParts = ConfigStore.currentRoute.split('/').filter(item => Boolean(item)).map(item => item.toLowerCase());

	if (!locationParts || locationParts.length === 0) {
		return null; // oops
	}

	const apps = getSubAppsWithRoutes();

	const isHomePage = locationParts[0] === 'home';
	const isConfigPage = locationParts[0] === 'config';

	const resolvedParts = locationParts.map((locationItem, idx) => {
		let resolvedTitle = '';
		let resolvedPath = '';

		let app = apps.find(subApp => {
			return subApp.routes.find(route => route.path === locationItem);
		});

		if (app) {
			resolvedTitle = app.title;
			resolvedPath = locationItem;
		}

		if (!app) {
			app = apps.find(subApp => {
				return subApp.routes.find(route => '/' + route.path === window.location.pathname);
			});

			if (app) {
				const exactRoute = app.routes.find(route => '/' + route.path === window.location.pathname);

				if (exactRoute) {
					resolvedTitle = exactRoute.title || exactRoute.spineTitle;
					resolvedPath = exactRoute.path;
				}
			}
		}

		if (isConfigPage) {
			resolvedTitle = 'Config';
		}

		return {
			path: resolvedPath || locationItem,
			title: resolvedTitle || locationItem,
			isLast: idx === locationParts.length - 1
		};
	});

	if (isHomePage) {
		document.body.classList.add('no-breadcrumbs');
		return null;
	}

	document.body.classList.remove('no-breadcrumbs');

	return <div className={'app-breadcrumbs'}>
		<Link to={'/home'}>Home</Link>

		{resolvedParts.map(part => {
			if (part.isLast) {
				return <span key={part.path}>{part.title}</span>;
			}
			return <><span></span><Link to={'/' + part.path} key={part.path}>{part.title}</Link></>;
		})}
	</div>;
});
