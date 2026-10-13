window.dataLayer = window.dataLayer || [];

function clc_gtag() {
	window.dataLayer.push(arguments);
}

/**
 * dataLayer event pushed after the `consent update` (granted) when the
 * visitor accepts on a page where GTM already started with consent denied.
 * A GTM trigger on it can re-send the page_view of that page, with consent.
 */
export const CONSENT_GRANTED_EVENT = "clc_consent_granted";

const DENIED = {
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	analytics_storage: "denied",
};

const GRANTED = {
	ad_storage: "granted",
	ad_user_data: "granted",
	ad_personalization: "granted",
	analytics_storage: "granted",
};

const isConsent = (item, type) => item?.[0] === "consent" && item?.[1] === type;
const isEvent = (item, event) => item?.event === event;

/**
 * GTM is loaded on page load, before consent: Consent Mode v2 defaults
 * every storage to "denied" until `onAccept` grants it.
 */
export const loadBeforeConsent = true;

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
 * @see https://developers.google.com/tag-platform/security/guides/consent
 *
 * The dataLayer order matters: GTM applies the consent state it finds
 * before the `gtm.js` event to the tags fired on it (page_view), so
 * `consent default`, then the stored consent, are pushed first.
 */
export function init({ containerID, callback }) {
	window.dataLayer = window.dataLayer || [];

	// do not set default consent if it is already defined ("Google Analytics for WooCommerce" plugin does include the default consent very early)
	if (!window.dataLayer.some((item) => isConsent(item, "default"))) {
		clc_gtag("consent", "default", { ...DENIED, wait_for_update: 500 });
	}

	// The callback (only given when the category is already accepted) runs
	// `onAccept`. The consent update is queued in the dataLayer, so there is no
	// need to wait for gtm.js: grant it now, before the `gtm.js` event.
	if (typeof callback === "function") callback();

	window.dataLayer.push({
		"gtm.start": new Date().getTime(),
		event: "gtm.js",
	});

	this.addScript(`https://www.googletagmanager.com/gtm.js?id=${containerID}`);
}

export function onAccept({ callback }) {
	// GTM already started (with consent denied) on this page
	const started = window.dataLayer.some((item) => isEvent(item, "gtm.js"));

	clc_gtag("consent", "update", GRANTED);

	if (
		started &&
		!window.dataLayer.some((item) => isEvent(item, CONSENT_GRANTED_EVENT))
	) {
		window.dataLayer.push({ event: CONSENT_GRANTED_EVENT });
	}

	if (typeof callback === "function") callback();
}

export function onReject() {
	// Skip when the latest consent update already denies (e.g. a second "Deny all")
	const lastUpdate = window.dataLayer
		.filter((item) => isConsent(item, "update"))
		.pop();
	if (lastUpdate?.[2]?.analytics_storage === "denied") return;

	clc_gtag("consent", "update", DENIED);
}
