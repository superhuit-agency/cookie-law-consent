=== Cookie Law Consent ===
Contributors: superhuit
Tags: cookies, cookie consent, gdpr, consent mode, privacy
Requires at least: 5.0
Tested up to: 6.7
Requires PHP: 7.0
Stable tag: 1.8.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.txt

Cookie banner and preferences modal that lets visitors accept or refuse cookies by category, with Google Consent Mode v2 support.

== Description ==

Cookie Law Consent displays a cookie banner and a preferences modal on your site. Third-party services are grouped into cookie categories, and visitors choose which categories they accept. Their choice is stored in a cookie and, for Google Tag Manager, sent to Google as Consent Mode v2 signals.

= Features =

* Cookie banner with "Accept all", "Deny all" and "Personalize" buttons.
* Preferences modal listing every cookie category with an on/off switch and a description.
* Six banner positions: top left, top right, center, bottom left, bottom right and full-width bottom.
* Unlimited, sortable cookie categories. A category can be marked as mandatory (always enabled).
* Built-in services: Google Tag Manager (with Google Consent Mode v2), Google Analytics, Facebook Pixel, Google reCAPTCHA, Google Maps and Salesforce Pardot.
* Every front-end text can be customized from the settings page.
* Multilingual support for WPML and Polylang: texts are saved per language.
* Re-open the preferences modal from any link pointing to `#cookie-law-settings`.
* Translations included: French (fr_FR) and English (en_GB).

= Google Consent Mode v2 =

When the Google Tag Manager service is enabled, the plugin sets the Consent Mode defaults to "denied" (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`), unless a default consent is already defined in the `dataLayer`. It then sends a consent update ("granted" or "denied") whenever the visitor accepts or refuses the category the service belongs to.

= How services are loaded =

In version 1.x, the visitor's choice does not block third-party scripts. Every enabled service that is assigned to a category is loaded on every page view, whether the visitor accepted its category, refused it or has not chosen yet. Only Google Tag Manager acts on the choice, through Google Consent Mode v2. Google Analytics, Facebook Pixel, Google reCAPTCHA, Google Maps and Pardot load and run regardless of consent. If these services must wait for consent, load them through Google Tag Manager and configure them to respect Consent Mode.

= For developers =

* Filter `clc_config` to change the configuration passed to the front-end script.
* Function `cookielawconsent_get_service( $name )` to read a service's settings, for example the reCAPTCHA secret key for server-side verification. The secret key is never sent to the browser.
* The stylesheet can be replaced by re-registering the `cookie-law-consent-style` handle.

Full developer documentation and source code: [github.com/superhuit-agency/cookie-law-consent](https://github.com/superhuit-agency/cookie-law-consent/tree/master-v1).

== Installation ==

1. Upload the `cookie-law-consent` folder to `/wp-content/plugins/`, or install the `cookie-law-consent.zip` file from **Plugins > Add New > Upload Plugin**.
2. Activate the plugin from the **Plugins** screen.
3. Go to **Settings > Cookie Law Consent**.
4. Choose a banner position and, if needed, customize the texts.
5. Review the cookie categories. "Necessary" (mandatory) and "Analytics" are created on activation.
6. Enable at least one service, assign it to a category and fill in its settings (container ID, tracking ID, keys, etc.). The banner only appears once at least one service is enabled.

== Frequently Asked Questions ==

= The banner does not show up. Why? =

The banner is only output when at least one service is enabled in **Settings > Cookie Law Consent > Services**. It is also hidden for visitors who have already accepted or refused cookies.

= How can visitors change their choice later? =

Add a link pointing to `#cookie-law-settings` anywhere on your site, for example in the footer or on your privacy policy page: `<a href="#cookie-law-settings">Cookie settings</a>`. Clicking it opens the preferences modal on the current page. Opening a URL that already ends with `#cookie-law-settings` from another page does not open the modal.

= How do I remove a category? =

Clear the category title and save the settings. Categories without a title are removed.

= Which cookies does the plugin set? =

`cookie-law-consent_banner` remembers that the banner was dismissed. `cookie-law-consent_{category}_accepted` stores "yes" or "no" for each non-mandatory category. Both last one year and are set with the `secure` flag, so they are only stored on sites served over HTTPS. The third-party services you enable set their own cookies.

= Can I use my own styles? =

Yes. Deregister the `cookie-law-consent-style` stylesheet on `init` (priority 20) and register your own file under the same handle. A ready-to-copy snippet is shown on the settings page.

= Does it work with WPML or Polylang? =

Yes. Switch the admin language to edit the texts for each language. Categories settings and services are shared by all languages.

= How do I get the reCAPTCHA secret key in my theme? =

Use `cookielawconsent_get_service( 'recaptcha' )`. It returns an array with `enabled`, `siteKey` and `secretKey`. The secret key is never sent to the browser.

= How can I override the translations? =

Place a `cookie-law-consent-{locale}.mo` file in `wp-content/languages/cookie-law-consent/`. It is loaded before the files shipped with the plugin.

== Changelog ==

= 1.8.3 - 2025-03-21 =
* Fix: PHP warning when a category has no service assigned.

= 1.8.2 - 2025-03-19 =
* Fix: services functions regression.
* Security: the reCAPTCHA secret key is no longer exposed in the front-end JavaScript.

= 1.8.1 - 2025-02-04 =
* Translations updated for the new "Deny all" button.
* Fix: all fields are displayed in the texts settings section.

= 1.8.0 - 2025-02-04 =
* New: "Deny all" button.

= 1.7.3 - 2025-01-16 =
* Fix: Consent Mode v2 not correctly set up.
* Fix: main script included in the head, earlier.

= 1.7.2 - 2025-01-10 =
* Fix: one more fix on Google Consent Mode v2.

= 1.7.1 - 2024-12-20 =
* Fix: Consent Mode v2 not correctly executed.

= 1.7.0 - 2024-12-19 =
* New: Google Consent Mode v2.
* Refactor: services use init, accept and reject callbacks.
* Dependencies upgraded and plugin files restructured (Node 20, webpack 5).
* Improved development demo page.
* Fix: only load accepted services when the "Save & Accept" button is clicked.

= 1.6.0 - 2023-04-27 =
* Repository moved to GitHub, with a CI release workflow.
* Node version upgraded to v14.
* Minor fixes.

= 1.5.0 - 2022-06-28 =
* New: Pardot service.
* Asset file names include a hash to improve cache invalidation.
* Fix: modal category toggle style.

= 1.4.1 - 2022-04-14 =
* Fix: banner initial hidden/shown style logic.

= 1.4.0 - 2022-02-08 =
* New: Google Maps service.

= 1.3.1 - 2021-09-03 =
* Fix: services in a mandatory category were not loaded.
* Fix: plugin version constant not correctly set.

= 1.3.0 - 2021-09-01 =
* New: API function `cookielawconsent_get_service`.

= 1.2.3 - 2021-08-05 =
* New: `clc_config` filter.
* Fix: improved cookie helper functions.
* Fix: banner cookie set and get.

= 1.2.2 - 2021-02-18 =
* New: Composer config file.

= 1.2.1 - 2021-02-11 =
* Fix: typo in French translations.

= 1.2.0 - 2021-02-10 =
* New: Polylang support for multilingual sites.
* Fix: attribute on the modal title (thanks to @luisbraga).
* Improved French translations.

== Upgrade Notice ==

= 1.8.3 =
Fixes a PHP warning on sites where a cookie category has no service assigned. Upgrade recommended.

= 1.8.2 =
Security fix: the reCAPTCHA secret key was exposed in the front-end JavaScript. Upgrade immediately if you use the reCAPTCHA service.

= 1.8.0 =
Adds a "Deny all" button to the banner. Check its label under Settings > Cookie Law Consent > Custom texts.

= 1.7.0 =
Adds Google Consent Mode v2 support for the Google Tag Manager service.
