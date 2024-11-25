/**
 * The available services are heavily
 * insppired/copied from tarteaucitron.js
 * and adapted to our needs
 *
 * @see https://github.com/AmauriC/tarteaucitron.js/blob/master/tarteaucitron.services.js
 */

import * as googleanalytics from "./googleanalytics";
import * as googletagmanager from "./googletagmanager";
import * as facebookpixel from "./facebookpixel";
import * as recaptcha from "./recaptcha";
import * as googlemaps from "./googlemaps";
import * as pardot from "./pardot";

export default {
	googleanalytics,
	googletagmanager,
	facebookpixel,
	recaptcha,
	googlemaps,
	pardot,
};
