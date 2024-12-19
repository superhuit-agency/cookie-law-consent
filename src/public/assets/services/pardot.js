/* eslint-disable curly */
/* global  */

/**
 * SalesForce Pardot
 *
 * Category: Analytics
 * Cookies: visitor_id
 *
 * @see https://www.salesforce.com/company/privacy/full_privacy/
 */
export function onAccept({ piAId, piCId, callback }) {
	window.piAId = piAId;
	window.piCId = piCId;
	window.piHostname = "pi.pardot.com";

	this.addScript("https://pi.pardot.com/pd.js", callback);
}
