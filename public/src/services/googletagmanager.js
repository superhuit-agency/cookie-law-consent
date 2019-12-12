/**
 * Google Tag Manager (gtm.js)
 *
 * Category: Analytics
 * cookies: _ga, _gat, __utma, __utmb, __utmc, __utmt, __utmz, __gads,
 *          _drt_, FLC, exchange_uid, id, fc, rrs, rds, rv, uid, UIDR,
 *          UID, clid, ipinfo, acs'
 *
 * @see https://adssettings.google.com
 *
 * dev documentation
 * @see https://support.google.com/tagmanager/answer/6103696
 */
export default function googletagmanager({ containerID, callback }) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		'gtm.start': new Date().getTime(),
		event: 'gtm.js',
	});

	return {
		url: `https://www.googletagmanager.com/gtm.js?id=${ containerID }`,
		callback,
	};
}
