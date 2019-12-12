export default {
	categories: [
		{
			mandatory: true,
			name: 'necessary',
			title: 'Necessary',
			description: 'Necessary cookies are absolutely essential for the website to function ' +
				'properly. This category only includes cookies that ensures basic ' +
				'functionalities and security features of the website. These cookies do not ' +
				'store any personal information.',
		},
		{
			name: 'non-necessary',
			title: 'Non Necessary',
			services: [
				{ name: 'googletagmanager', containerID: 'GTM-XXX', callback: () => console.info('GTag Loaded') },
				{ name: 'googleanalytics', trackingID: 'UA-XXXXX-Y', anonymizeIp: true },
			],
		},
		{
			name: 'marketing',
			title: 'Marketing',
			description: 'Used to deliver advertising that is more relevant to you and your interests. ' +
				'They are also used to limit the number of times you see an advertisement as well as help ' +
				'measure the effectiveness of the advertising campaign. They are usually placed by ' +
				'advertising networks with the website operator’s permission.',
			texts: {
				enable: 'Enable Marketing cookies',
				disable: 'Disable Marketing cookies',
			},
		},
	],
	texts: {
		banner: {},
		modal: {},
		category: {},
	},
};
