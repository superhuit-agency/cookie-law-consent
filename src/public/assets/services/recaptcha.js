/* eslint-disable curly */
/* global  */

/**
 * Google ReCAPTCHA
 *
 * Category: API
 * Cookies: nid
 *
 * @see https://policies.google.com/privacy
 */
export function onAccept({ callback }) {
	window.recaptchaOnLoad = () => {
		if (typeof callback === "function") callback();
	};

	this.addScript(
		"https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad",
		null
	);
}
