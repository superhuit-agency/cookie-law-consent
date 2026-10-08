=== Cookie Law Consent ===
Contributors: superhuit
Tags: cookie, gdpr, consent, cookie consent, graphql
Requires at least: 5.0
Tested up to: 6.5
Requires PHP: 7.3
Stable tag: 2.2.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.txt

Configure GDPR cookie consent texts, categories and services in WordPress, and expose them to your front end via WPGraphQL or the REST API.

== Description ==

Cookie Law Consent lets you manage the configuration of your cookie consent solution from the WordPress admin: banner and modal texts, cookie categories and third-party services.

**Important:** since version 2.0.0 the plugin does not display a cookie banner on the front end. It provides the settings page and exposes the configuration. Your theme or headless front end reads it and shows the banner, stores the visitor's consent and loads the services.

= Features =

* Settings page under Settings > Cookie Law Consent.
* Custom banner texts: title, description, "Accept all", "Reject all" and "Personalize".
* Custom modal texts: title, description, "Close" and "Save".
* Cookie categories with position, mandatory flag, title, description and custom texts (enable, enabled, disable, disabled, always enabled). "Necessary" (mandatory) and "Analytics" categories are created on activation. New categories cannot be added from the settings page.
* Third-party services that can be enabled, assigned to a category and configured.
* A configurable hash (default `manage-cookies`) so the front end can reopen the consent modal from any link to `#manage-cookies`.
* Multilingual support with WPML and Polylang: texts are translated per language, while choices and enabled services are shared by all languages.
* French and English (UK) translations included.

= Available services =

* Google Tag Manager (Container ID)
* Google Analytics 4 (Property ID)
* Facebook Pixel (Pixel ID)
* Google Maps (API Key)

= For developers =

* **WPGraphQL:** a `gdpr` field on the root query returns the configuration as a JSON string, with translated texts and enabled services grouped by category. On multilingual sites it accepts a `language` argument.
* **REST API:** the raw configuration is available as the `cookielawconsent` setting (JSON string) on the `/wp/v2/settings` endpoint, which requires the `manage_options` capability.
* **PHP:** `cookielawconsent_get_service( $name )` returns a service's saved configuration, with `enabled` as a boolean.

The plugin does not add any custom actions, filters or shortcodes.

Full documentation and source code: [github.com/superhuit-agency/cookie-law-consent](https://github.com/superhuit-agency/cookie-law-consent)

== Installation ==

1. Download `cookie-law-consent.zip` from the [GitHub releases](https://github.com/superhuit-agency/cookie-law-consent/releases).
2. In your WordPress admin go to Plugins > Add New > Upload Plugin, select the zip and click "Install Now". You can also unzip it into `/wp-content/plugins/` (the zip contains a `cookie-law-consent` folder).
3. Activate the plugin from the Plugins screen.
4. Go to Settings > Cookie Law Consent to set up texts, categories and services, and save the page once. Some keys of the configuration are only created on the first save.
5. Install and activate WPGraphQL if your front end reads the configuration through GraphQL.

= Installing from source =

The compiled admin assets (`dist/`) are not stored in the repository. After cloning, run `yarn install` and then `yarn build:production` with Node.js 14.

== Frequently Asked Questions ==

= Does the plugin display a cookie banner on my site? =

No. Since version 2.0.0 the plugin only stores the configuration. Your theme or front-end application must read it (through WPGraphQL, the REST API or the PHP function `cookielawconsent_get_service()`) and render the banner and modal.

= How do I get the configuration in my front end? =

With WPGraphQL active, query `{ gdpr }` and parse the returned JSON string. On a WPML or Polylang site, pass a language, for example `{ gdpr(language: FR) }`. The `LanguageCodeEnum` type of this argument is not registered by this plugin: it must come from a WPGraphQL language extension such as WPGraphQL for Polylang.

= How do I check whether a service is enabled in PHP? =

`$gtm = cookielawconsent_get_service( 'googletagmanager' );` returns an array. `$gtm['enabled']` is a boolean, and the service fields are included, for example `$gtm['containerID']`. The service keys are `googletagmanager`, `googleanalytics`, `facebookpixel` and `googlemaps`.

= What is the "Hash" setting for? =

It is a hash your front end can listen for to open the cookie settings modal at any time, for example with a footer link `<a href="#manage-cookies">Manage cookies</a>`.

= How do I translate the texts on a multilingual site? =

With WPML or Polylang active, switch the admin language and save the settings page in each language. Texts are saved per language. Category order, the mandatory flag and services apply to all languages.

= How do I delete a category? =

Empty its title and save. Categories without a title are removed. A removed category cannot be added back from the settings page.

= What happens to my settings when I delete the plugin? =

The uninstall routine is meant to delete the `cookie_law_consent` option. In version 2.2.0 it relies on a class that is not loaded during uninstall, so it may fail. If the option is still there after you delete the plugin, remove it manually, for example with `wp option delete cookie_law_consent`.

== Changelog ==

= 2.2.0 - 2024-04-27 =
* Added: Google Analytics 4 service.

= 2.1.0 - 2023-04-27 =
* Changed: Repository moved to GitHub.
* Changed: Project stack and structure adapted to GitHub.
* Added: CI release workflow.
* Changed: Node version in the stack upgraded to v14.
* Fixed: Undefined array key "language" (#1).
* Fixed: Minor fixes.

= 2.0.2 - 2022-03-17 =
* Added: Google Maps service.
* Added: Configuration exposed through the settings REST API.

= 2.0.1 - 2022-01-11 =
* Fixed: GDPR configuration returned even if no services are configured (still needed for necessary cookies).

= 2.0.0 - 2021-12-03 =
* Breaking: the plugin no longer handles the front end. It only provides the configuration in the WordPress admin.
* Removed: Front-end code.
* Removed: reCAPTCHA service.
* Added: GraphQL support (instead of a global variable).
* Fixed: Language variable used to get category texts.

= 1.3.1 - 2021-09-03 =
* Fixed: Services in a mandatory category not loaded.
* Fixed: Plugin version constant not set correctly.

= 1.3.0 - 2021-09-01 =
* Added: API function `cookielawconsent_get_service`.

= 1.2.3 - 2021-08-05 =
* Fixed: Improved cookie helper functions.
* Fixed: Banner cookie set and get.
* Added: `clc_config` filter to filter the configuration array (removed with the front-end code in 2.0.0).

= 1.2.2 - 2021-02-18 =
* Added: Composer config file.

= 1.2.1 - 2021-02-11 =
* Fixed: Typo in French translations.

= 1.2.0 - 2021-02-10 =
* Added: Polylang support for multilingual sites.
* Fixed: Attribute on cookie-law-modal title, thanks to @luisbraga.
* Fixed: Improved French translations.

== Upgrade Notice ==

= 2.2.0 =
Adds a Google Analytics 4 service.

= 2.0.0 =
Breaking change: the plugin no longer renders the cookie banner on the front end and the reCAPTCHA service was removed. Your front end must read the configuration via WPGraphQL (or the REST API) before you upgrade.
