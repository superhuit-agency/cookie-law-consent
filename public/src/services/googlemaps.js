/* eslint-disable curly */
/* global  */

/**
 * Google Google Maps
 *
 * Category: API
 * Cookies: nid
 *
 * @see https://policies.google.com/privacy
 */
export default function googlemaps({ apiKey, selector = 'data-gmaps', callback = null }) {
	window.gmapsCallback = window.gmapsCallback || function() {
		Array.from(document.querySelectorAll(`[${selector}]`)).forEach((el) => {
			new google.maps.Map(
				el,
				{
					disableDefaultUI: true,
					zoomControl     : true,
					scrollwheel     : false,
					zoom            : parseInt(el.dataset?.zoom ?? 10),
					center          : new google.maps.LatLng(
						parseFloat(el.dataset?.latitude ?? 10),
						parseFloat(el.dataset?.longitude ?? 10)
					),
				}
			);

			if (typeof callback === 'function') callback()
		});
	}

	return {
		url: `//maps.googleapis.com/maps/api/js?v=3.exp&key=${apiKey}&callback=gmapsCallback`,
		callback
	}
}
