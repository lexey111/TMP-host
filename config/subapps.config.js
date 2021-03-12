module.exports = {
	topbar: {
		name: 'Top bar',
		dist: 'TMP-sub-topbar/dist',
		port: 3035,
		homeCard: true
	},

	spine: {
		name: 'Left bar (spine)',
		dist: 'TMP-sub-spine/dist',
		port: 3033,
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
		port: 3034,
		homeCard: true,
		routes: [{
			path: 'manual-template', // url: ...site.com/manual-template
			view: 'template/manual' // bundleName/viewName
		}]
	},

	online: {
		name: 'Online',
		online: true,
		dist: 'TMP-sub-online/dist',
		port: 3032,
		homeCard: true,
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
		dist: 'TMP-sub-examples/dist',
		port: 3031,
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
		port: 3036,
		homeCard: ['home', 'chart'],
	},

	example_svelte: {
		name: 'Svelte JS',
		dist: 'TMP-sub-svelte/dist',
		port: 3037,
		homeCard: true,
	},
};
