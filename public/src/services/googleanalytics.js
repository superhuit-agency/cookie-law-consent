/* global ga */
/* eslint-disable func-names, prefer-rest-params, curly */

/**
 * Google Analytics  (analytics.js) Tag
 *
 * Category: Analytics
 * Cookies _ga, _gat, _gid, __utma, __utmb, __utmc, __utmt, __utmz
 *
 * @see https://support.google.com/analytics/answer/6004245
 *
 * dev documentation
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs
 */
export default function googleanalytics({ trackingID, callback, anonymizeIp = true }) {
	window.GoogleAnalyticsObject = 'ga';
	window.ga = window.ga || function() {
		window.ga.q = window.ga.q || [];
		window.ga.q.push(arguments);
	};

	window.ga.l = new Date();

	return {
		url: 'https://www.google-analytics.com/analytics.js',
		callback: () => {
			ga('create', trackingID, { cookieExpires: 34128000 });
			ga('set', 'anonymizeIp', anonymizeIp);
			ga('send', 'pageview');

			if (typeof callback === 'function') callback();
		},
	};
}
