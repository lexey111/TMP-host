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
		online: false,
		dist: 'TMP-sub-examples/dist',
		port: 3031,
		routes: [
			{
				path: 'ui_examples/cr_basic',
				view: 'ui_examples/controlRoomBasic',
			},
			{
				path: 'ui_examples/cr_elements',
				view: 'ui_examples/controlRoomElements',
			},
			{
				path: 'ui_examples/cr_section',
				view: 'ui_examples/controlRoomSection',
			},
			{
				path: 'ui_examples/cr_tile',
				view: 'ui_examples/controlRoomTile',
			},
			{
				path: 'ui_examples/cr_room',
				view: 'ui_examples/controlRoomRoom',
			},
			// general
			{
				path: 'ui_examples/icons',
				view: 'ui_examples/icons',
			},
			{
				path: 'ui_examples/modals',
				view: 'ui_examples/modals',
			},
			{
				path: 'ui_examples/messages',
				view: 'ui_examples/messages',
			},
			{
				path: 'ui_examples/validation',
				view: 'ui_examples/validation',
			},
			// listing
			{
				path: 'ui_examples/listing_empty',
				view: 'ui_examples/listingEmpty',
			},
			{
				path: 'ui_examples/listing_description',
				view: 'ui_examples/listingDescription',
			},
			{
				path: 'ui_examples/listing_basic',
				view: 'ui_examples/listingBasic',
			},
			{
				path: 'ui_examples/listing_bulk_actions',
				view: 'ui_examples/listingBulkActions',
			},
			{
				path: 'ui_examples/listing_row_actions',
				view: 'ui_examples/listingRowActions',
			},
			{
				path: 'ui_examples/listing_details',
				view: 'ui_examples/listingDetails',
			},
			// must be the last one!
			{
				path: 'ui_examples', // url: ...site.com/ui_examples
				view: 'ui_examples/controlRoom', // bundleName/viewName
				spineIcon: 'compass',
				spineTitle: 'UI Library examples'
			},
		]
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
