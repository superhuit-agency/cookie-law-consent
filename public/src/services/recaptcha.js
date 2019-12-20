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
export default function recaptcha({ callback }) {
	window.recaptchaOnLoad = () => {
		if (typeof callback === 'function') callback();
	};

	/* eslint-disable curly */
	return {
		url: 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad',
		callback: null,
	};
}
