module.exports = {
	topbar: {
		name: 'Top bar',
		dist: 'TMP-sub-topbar/dist',
		homeCard: true,
		entry: 'topbar.js',
		styles: 'topbar.css'
	},
	spine: {
		name: 'Left bar (spine)',
		dist: 'TMP-sub-spine/dist',
		homeCard: false,
		entry: 'spine.js',
		styles: 'spine.css',
		routes: [{
			path: 'config', // url: ...site.com/config
			spineIcon: 'settings',
			spineTitle: 'Settings page',
			position: 'bottom'
		}]
	},
	template: {
		name: 'Template',
		dist: 'TMP-sub-template/dist',
		homeCard: true,
		entry: 'template.js',
		styles: 'template.css',
		routes: [{
			path: 'manual-template', // url: ...site.com/manual-template
			view: 'template/manual' // bundleName/viewName
		}]
	},
	online: {
		name: 'Online',
		online: true,
		homeCard: true,
		entry: 'http://localhost:3032/online.js',
		styles: 'http://localhost:3032/online.css',
		routes: [{
			path: 'manual-online', // url: ...site.com/manual-online
			view: 'online/manual', // bundleName/viewName
			spineIcon: 'cloud',
			spineTitle: 'Manual for online sub-apps'
		}]
	},
	ui_examples: {
		name: 'UI Library examples',
		online: true,
		homeCard: true,
		entry: 'http://localhost:3031/ui_examples.js',
		styles: 'http://localhost:3031/ui_examples.css',
		routes: [{
			path: 'ui_examples', // url: ...site.com/ui_examples
			view: 'ui_examples/controlRoom', // bundleName/viewName
			spineIcon: 'compass',
			spineTitle: 'UI Library examples'
		}]
	},
	example_vue: {
		name: 'Vue JS',
		dist: 'TMP-sub-vue/dist',
		homeCard: ['home', 'chart'],
		entry: 'example_vue.js',
		styles: 'example_vue.css'
	},
};
