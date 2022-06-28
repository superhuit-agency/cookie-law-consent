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
export default function pardot({ piAId, piCId, callback }) {

	window.piAId = piAId;
  window.piCId = piCId;
  window.piHostname = 'pi.pardot.com';

	/* eslint-disable curly */
	return {
		url: 'https://pi.pardot.com/pd.js',
		callback,
	};
}
