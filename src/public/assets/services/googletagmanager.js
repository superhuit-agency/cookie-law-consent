const gtag = () => {
	window.dataLayer = window.dataLayer || [];
	dataLayer.push(arguments);
};

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
export function init({ containerID, callback }) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		"gtm.start": new Date().getTime(),
		event: "gtm.js",
	});

	// Set default consent to 'denied' as a placeholder
	// Determine actual values based on your own requirements
	gtag("consent", "default", {
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		analytics_storage: "denied",
	});

	this.addScript(
		`https://www.googletagmanager.com/gtm.js?id=${containerID}`,
		callback
	);
}

export function onAccept({ callback }) {
	gtag("consent", "update", {
		ad_storage: "granted",
		ad_user_data: "granted",
		ad_personalization: "granted",
		analytics_storage: "granted",
	});

	if (typeof callback === "function") callback();
}

export function onReject() {
	gtag("consent", "update", {
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		analytics_storage: "denied",
	});
}
