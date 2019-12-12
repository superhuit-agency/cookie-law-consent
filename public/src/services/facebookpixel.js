/* eslint-disable no-unused-vars */
/* global _fbq, fbq */

/**
 * Facebook Pixel (fbevents.js)
 *
 * Category: Marketing
 * Cookies: datr, fr, reg_ext_ref, reg_fb_gate, reg_fb_ref, sb, wd, x-src
 *
 * @see https://fr-fr.facebook.com/business/help/www/651294705016616
 */
export default function facebookpixel({ pixelID, callback }) {
	/* eslint-disable */
	let n;
	if(window.fbq) return {};
	n=window.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)} ;
	if(!window._fbq)window._fbq=n;
	n.push=n;
	n.loaded=!0;
	n.version='2.0';
	n.queue=[];
	/* eslint-enable */

	/* eslint-disable curly */
	return {
		url: 'https://connect.facebook.net/en_US/fbevents.js',
		callback: () => {
			fbq('init', pixelID);
			fbq('track', 'PageView');

			if (typeof callback === 'function') callback();
		},
	};
}
