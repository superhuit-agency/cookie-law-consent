# Cookie Law Consent

> Handle your cookies and give your visitors the ability to accept or refuse them.

**Cookie Law Consent** is a lightweight WordPress plugin by [superhuit](https://www.superhuit.ch) that displays a cookie consent banner and a preferences modal, groups third-party services into cookie categories and stores the visitor's choice for each category. For Google Tag Manager, that choice is passed on as Google Consent Mode v2 signals.

> [!NOTE]
> This branch (`master-v1`) is **version 1.x** of the plugin, which **renders the consent UI on the front end** (banner, preferences modal) and loads the configured services itself. Version 2.x, on the `master` branch, is a back-end-only plugin: it stores the configuration and exposes it (WPGraphQL, REST API) for a decoupled/headless front end to render. Pick the version that matches your setup.

- **Current version:** 1.9.0
- **Text domain:** `cookielawconsent`
- **License:** GPL-2.0+ (see [License](#license))

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available services](#available-services)
- [How consent is stored](#how-consent-is-stored)
- [Consent statistics](#consent-statistics)
- [Developer reference](#developer-reference)
- [Development](#development)
- [Changelog](#changelog)
- [License](#license)
- [Credits](#credits)

---

## Features

- Cookie **banner** with *Accept all*, *Deny all* and *Personalize* actions.
- **Preferences modal** listing every cookie category with an on/off switch and a description.
- Six **banner positions**: top left, top right, center, bottom left, bottom right (default) and full-width bottom.
- Unlimited, sortable **cookie categories**, each of which can be marked as *mandatory* (always enabled, cannot be refused).
- Built-in **services**: Google Tag Manager (with Google Consent Mode v2), Google Analytics, Facebook Pixel, Google reCAPTCHA, Google Maps and Salesforce Pardot. Their scripts only load once the visitor accepts their category (Google Tag Manager loads earlier, with Consent Mode defaults `denied`); see [How services are loaded](#how-services-are-loaded).
- All front-end **texts are customizable** from the settings page (banner, modal and per-category labels).
- **Multilingual** support for [WPML](https://wpml.org) and [Polylang](https://wordpress.org/plugins/polylang/): texts are stored per language, while categories enabling and services are shared across languages.
- Any page can re-open the preferences modal with a simple `#cookie-law-settings` link.
- Translations shipped for **French (fr_FR)** and **English (en_GB)**.
- reCAPTCHA **secret key is never exposed** to the front end (since 1.8.2).
- Optional **consent statistics**: when [wp-cookie-consent-analytics](https://github.com/superhuit-agency/wp-cookie-consent-analytics) is active, banner impressions and choices are sent to it; see [Consent statistics](#consent-statistics).
- **DOM events** (`cookielaw:impression`, `cookielaw:accept`, `cookielaw:reject`, `cookielaw:save`) for themes to hook into; see [DOM events](#dom-events).

## Requirements

| Requirement | Version |
| --- | --- |
| WordPress | 5.0 or higher, tested up to 6.7 (same values as `readme.txt`) |
| PHP | 7.0 or higher (`composer.json`) |
| Node.js *(build only)* | 24.x (`.nvmrc` / `package.json` `engines`) |
| Yarn *(build only)* | 1.22 (`packageManager` in `package.json`) |
| Composer *(build only)* | Any recent version |

## Installation

### From a release zip (recommended)

Every `v*.*.*` tag triggers the [release workflow](.github/workflows/release-plugin.yml), which builds the assets and attaches a ready-to-install `cookie-law-consent.zip` to the corresponding [GitHub release](https://github.com/superhuit-agency/cookie-law-consent/releases).

1. Download `cookie-law-consent.zip` from a **1.x** release (e.g. `v1.9.0`).
2. In the WordPress admin, go to **Plugins → Add New → Upload Plugin** and upload the zip.
3. Activate **Cookie Law Consent**.
4. Configure it under **Settings → Cookie Law Consent**.

### From source

The compiled assets (`dist/`) are not committed, so you need to build them.

```bash
cd wp-content/plugins
git clone -b master-v1 https://github.com/superhuit-agency/cookie-law-consent.git
cd cookie-law-consent

# PHP dependencies (use --no-dev for a production install)
composer install --no-dev

# JS/CSS assets
nvm use            # Node 24
yarn install --frozen-lockfile
yarn build:production
```

Then activate the plugin from the **Plugins** screen.

> [!IMPORTANT]
> The plugin reads `dist/manifest.json` to enqueue its scripts and styles. If the assets have not been built, neither the banner nor the admin settings scripts will load.

## Configuration

All settings live on a single page: **Settings → Cookie Law Consent** (requires the `manage_options` capability). They are stored in the `cookie_law_consent` option.

On activation, the plugin creates default settings: banner position *bottom right* and two categories, **Necessary** (mandatory) and **Analytics**.

### Appearance

- **Banner position**: `top-left`, `top-right`, `center`, `bottom-left`, `bottom-right` or `full-bottom`.

To replace the plugin stylesheet entirely, deregister it and register your own under the same handle:

```php
add_action( 'init', function() {
	if ( ! wp_style_is( 'cookie-law-consent-style', 'registered' ) ) return;
	wp_deregister_style( 'cookie-law-consent-style' );
	wp_register_style( 'cookie-law-consent-style', 'path/to/your/theme/cookie-law-consent.css' );
}, 20 );
```

### Custom texts

Override any default label; empty fields fall back to the translated defaults.

| Banner text | Key | Default |
| --- | --- | --- |
| Title | `title` | Cookies |
| Personalize link | `personalize` | Personalize |
| Description | `message` | This site uses cookies to help improve your user experience… |
| Accept all button | `acceptAll` | Ok, accept all |
| Deny all button | `denyAll` | Deny all |

| Modal text | Key | Default |
| --- | --- | --- |
| Title | `title` | Privacy Overview |
| Close button | `close` | Close |
| Description | `description` | This website uses cookies to improve your experience… |
| Save button | `save` | Save & Accept |

### Categories

Each category has:

- an **ID** (`necessary`, `analytics`, or an auto-generated `cat-xxxxxxxxx` for new categories), used in the consent cookie name;
- a **position** (display order);
- a **mandatory** switch: mandatory categories are always enabled and their services always run;
- a **title** and a **description**;
- optional **custom texts**: `enable`, `enabled`, `disable`, `disabled` and `alwaysEnabled` (shown for mandatory categories).

Add a category with the **+** button. To remove one, clear its title and save: categories without a title are discarded.

### Services

For each [available service](#available-services): switch **Enable?** on, pick the **Category** it belongs to and fill in its fields. Only enabled services are saved.

> [!NOTE]
> The front-end banner is only output when at least one service is enabled. An enabled service that has no category assigned is not loaded on the front end.

### Multilingual sites

With WPML or Polylang active, the settings page shows which language you are editing. Texts (banner, modal, category titles, descriptions and labels) are saved for the current admin language; category settings and services apply to all languages. Missing translations fall back to the default language.

### Re-opening the preferences

Any link pointing to `#cookie-law-settings` opens the preferences modal, e.g. in your footer or privacy policy:

```html
<a href="#cookie-law-settings">Cookie settings</a>
```

The modal opens on the browser's `hashchange` event, so the link has to change the hash of the current page. Loading a URL that already ends with `#cookie-law-settings` (for example a link from another page) does not open it.

## Available services

Services are defined in [`src/available-services.php`](src/available-services.php) (admin fields) and implemented in [`src/public/assets/services/`](src/public/assets/services/) (front end).

| Service | Key | Settings fields | Front-end behaviour (once loaded) |
| --- | --- | --- | --- |
| Google Tag Manager | `googletagmanager` | `containerID` (e.g. `GTM-XXX`) | Loads `gtm.js` and sets **Google Consent Mode v2** defaults to `denied` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`, with `wait_for_update: 500`), unless a `consent default` entry already exists in `dataLayer`. Sends a `consent update` with `granted` when the category is accepted (on page load, before the `gtm.js` event, if it was accepted earlier or the category is mandatory), followed by a `clc_consent_granted` event when it is accepted during the page view, and with `denied` when it is refused. See [Google Tag Manager setup](#google-tag-manager-setup). |
| Google Analytics | `googleanalytics` | `trackingID` (e.g. `UA-XXXXX-Y`), `anonymizeIp` (switch, default on) | Loads `analytics.js` (Universal Analytics), creates the tracker and sends a pageview. Google has retired Universal Analytics; for GA4, use Google Tag Manager. |
| Facebook Pixel | `facebookpixel` | `pixelID` | Loads `fbevents.js`, then calls `fbq('init', pixelID)` and tracks `PageView`. |
| Google reCAPTCHA | `recaptcha` | `siteKey`, `secretKey` | Loads `https://www.google.com/recaptcha/api.js`. The `secretKey` is stripped from the front-end config. |
| Google Maps | `googlemaps` | `apiKey` | Loads the Maps JavaScript API and renders a map in every element with a `data-gmaps` attribute (see [below](#google-maps-markup)). |
| Pardot | `pardot` | `piAId`, `piCId` | Sets `piAId`, `piCId`, `piHostname` and loads `pd.js`. |

### How services are loaded

A service's `init()` function is what loads its third-party script, and it only runs once the visitor has consented to the service's category:

- On page load (`DOMContentLoaded`), services in a **mandatory** category, or in a category accepted earlier (see [consent cookies](#how-consent-is-stored)), are loaded.
- Services in a category that is refused or not chosen yet are **not** loaded. They are loaded later during the same page view if the visitor accepts the category (*Accept all*, or switched on and saved in the modal).
- **Google Tag Manager** is the exception: it is loaded on every page view, with Google Consent Mode v2 defaults set to `denied`, and its consent state is updated when the category is accepted or refused.

Refusing a category after its services were loaded does not unload their scripts; it only runs their `onReject` (Google Tag Manager switches Consent Mode to `denied`).

### Google Tag Manager setup

On every page view, the plugin pushes to the `dataLayer`, in this order:

1. `consent default`: everything `denied`, with `wait_for_update: 500` (skipped if another plugin, e.g. *Google Analytics for WooCommerce*, already pushed a `consent default`).
2. `consent update` with everything `granted`, only if the visitor accepted the category on an earlier page (or the category is mandatory).
3. The `gtm.js` event, then the GTM container script is injected.

So the tags fired on the first page view (*Initialization* / *All Pages*) already see the visitor's stored choice. When the visitor makes a choice on the page, the plugin pushes:

- **Accept**: `consent update` with everything `granted`, then the event `{ event: "clc_consent_granted" }` (at most once per page view).
- **Deny**: `consent update` with everything `denied` (not repeated while consent is already denied).

Recommended container setup:

- **GA4 tags** (Google tag and GA4 event tags): keep their built-in consent checks (`analytics_storage`, and `ad_storage` for ads features) and fire them on the usual triggers. Do not add *Additional consent checks* that block them: with Consent Mode they send cookieless pings until consent is granted.
- **Landing page view after a first-visit accept**: the page_view of the page where the visitor accepts was sent before consent, without cookies, so the landing page and its source (`gclid`, UTM) are lost from the observed data. Add a *Custom Event* trigger on `clc_consent_granted` and use it to fire a GA4 event tag that sends `page_view` (with the same Measurement ID) once more. The event is not pushed for visitors who accepted on an earlier page, as their first page_view is already sent with consent.


### Service lifecycle

Each front-end service module may export three functions, all called with the service settings as argument and the main `CookieLaw` instance as `this`:

- `init(data)`: called at most once per page view, when the service's category is enabled: on page load if it is mandatory or was accepted earlier, otherwise when the visitor accepts it. It receives a `callback` to call once the service is ready; that callback runs `onAccept` (Google Tag Manager calls it synchronously, before the `gtm.js` event).
- `onAccept(data)`: called when the service's category is accepted: on page load (via the `init` callback) if consent was already given, after *Accept all*, or after *Save & Accept* for a category switched on in the modal. If the service was already loaded, it is called right away.
- `onReject(data)`: called when a category that was accepted during the current page view is refused (*Deny all*, or switched off and saved in the modal). For a `loadBeforeConsent` service, it is also called when the category is refused without having been accepted.

A service module may also export `loadBeforeConsent = true` to have `init` called on every page load whatever the consent state (without the `onAccept` callback). Only use it for services that wait for consent themselves.

On this branch only **Google Tag Manager** sets `loadBeforeConsent` and implements `onAccept`/`onReject` (to update the Consent Mode state); the other services only implement `init`.

### Google Maps markup

```html
<div data-gmaps data-latitude="46.5197" data-longitude="6.6323" data-zoom="12" style="height: 400px"></div>
```

`data-latitude` / `data-longitude` default to `10` and `data-zoom` to `10`.

## How consent is stored

All cookies are set for one year, on path `/`, with `secure` and `samesite=strict`. The prefix is `cookie-law-consent` by default (see `cookieName` in the [front-end config](#front-end-config-object)). Because the `secure` flag is always set, browsers will not store these cookies on a site served over plain HTTP, so the visitor's choice is not remembered there.

| Cookie | Value | Meaning |
| --- | --- | --- |
| `cookie-law-consent_banner` | `dismiss` | The banner has been dismissed and will not be shown again. |
| `cookie-law-consent_{categoryId}_accepted` | `yes` / `no` | The visitor's choice for a non-mandatory category. |

Mandatory categories never get a cookie: they are always considered accepted.

## Consent statistics

When [wp-cookie-consent-analytics](https://github.com/superhuit-agency/wp-cookie-consent-analytics) is installed and active, the banner sends its events to that plugin's REST endpoint, `POST /wp-json/supt/v1/cookie-stats`. There is no setting: statistics are on when, and only when, that plugin is active. It stays optional; without it, the plugin sends nothing.

The plugin counts as active when both its `COOKIE_ANALYTICS_VERSION` constant and its `Cookie_Analytics_API` class exist. An install missing its Composer dependencies defines the constant but never registers the REST route, so it counts as inactive.

| Event | Sent when |
| --- | --- |
| `impression` | The banner is shown, **once per browser session** (the banner shows again on every page until a choice is made; counting each page would understate the opt-in rate). |
| `accept` | The visitor clicks *Accept all*. |
| `reject` | The visitor clicks *Deny all*. |
| `personalize` | The visitor saves the preferences modal while the banner is still shown (their first choice). |

Only the first choice is counted: later changes made through a [`#cookie-law-settings` link](#re-opening-the-preferences) are not sent.

With wp-cookie-consent-analytics **1.1.0 or later**, `personalize` also carries the accepted categories, `{ "event_type": "personalize", "granted": ["analytics"] }` (IDs of the non-mandatory categories that are enabled). Earlier versions only accept the event type, so they receive `{ "event_type": "personalize" }`.

How the events are sent:

- with `navigator.sendBeacon()` (falling back to `fetch()` with `keepalive`), so they still arrive when the visitor leaves the page right after clicking; sending never blocks nor throws;
- without a nonce: the endpoint URL comes from the [front-end config](#front-end-config-object), so it works on fully cached pages;
- for a sample of browser sessions (all of them by default, see `clc_stats_sample_rate` below). The sampling decision is made once per session and stored with the impression flag in the `{cookieName}_stats` `sessionStorage` entry, so impressions and choices come from the same sessions.

### PHP filter: `clc_stats_endpoint`

Filters the URL the events are sent to. Return `false` to disable the statistics. Only runs when wp-cookie-consent-analytics is active.

```php
apply_filters( 'clc_stats_endpoint', string $endpoint ); // default: rest_url( 'supt/v1/cookie-stats' )
```

```php
// Don't collect statistics on the landing pages
add_filter( 'clc_stats_endpoint', function( $endpoint ) {
	return is_page( 'landing' ) ? false : $endpoint;
} );
```

### PHP filter: `clc_stats_sample_rate`

Filters the share of browser sessions whose events are sent, between `0` (none) and `1` (all, the default). Values outside that range are clamped, non-numeric values fall back to `1`.

```php
// Only send the events of 1 session out of 10
add_filter( 'clc_stats_sample_rate', fn() => 0.1 );
```

## Developer reference

### PHP filter: `clc_config`

Filters the configuration array passed to the front-end script (as the `clc_config` JS global) right before the assets are enqueued on `wp_enqueue_scripts`. It only runs on the front end, and only when at least one service is enabled (otherwise the plugin outputs nothing).

```php
apply_filters( 'clc_config', array $config );
```

The array has this shape:

```php
[
	'banner_position' => 'bottom-right',
	'texts' => [
		'banner' => [ 'title' => '…', 'personalize' => '…', 'message' => '…', 'acceptAll' => '…', 'denyAll' => '…' ],
		'modal'  => [ 'title' => '…', 'close' => '…', 'description' => '…', 'save' => '…' ],
	],
	'categories' => [
		[
			'id'          => 'analytics',
			'position'    => 2,
			'mandatory'   => false,
			'title'       => 'Analytics',
			'description' => '…',
			'texts'       => [ 'enable' => '…', 'enabled' => '…', 'disable' => '…', 'disabled' => '…', 'alwaysEnabled' => '…' ],
			'services'    => [
				[ 'name' => 'googletagmanager', 'containerID' => 'GTM-XXX' ],
			],
		],
		// …
	],
]
```

Texts are already resolved for the current language. The plugin hooks its own callback at priority `5` to remove the reCAPTCHA `secretKey`; callbacks at the default priority (`10`) run afterwards.

Example: change the banner message on a specific page and use a custom cookie prefix:

```php
add_filter( 'clc_config', function( $config ) {
	if ( is_page( 'landing' ) ) {
		$config['texts']['banner']['message'] = __( 'We use cookies to measure this campaign.', 'my-theme' );
	}

	// Keys missing from the PHP config fall back to the JS defaults
	// (cookieName: "cookie-law-consent", hash: "cookie-law-settings").
	$config['cookieName'] = 'my-site-consent';

	return $config;
} );
```

### PHP function: `cookielawconsent_get_service()`

```php
cookielawconsent_get_service( string $name ) : array
```

Returns the saved settings of a service (by its [key](#available-services)), with `enabled` cast to a boolean. A service that is not enabled returns `[ 'enabled' => false ]`.

Example: verify a reCAPTCHA token server side using the secret key stored in the plugin:

```php
$recaptcha = cookielawconsent_get_service( 'recaptcha' );

if ( $recaptcha['enabled'] && ! empty( $recaptcha['secretKey'] ) ) {
	$response = wp_remote_post( 'https://www.google.com/recaptcha/api/siteverify', [
		'body' => [
			'secret'   => $recaptcha['secretKey'],
			'response' => sanitize_text_field( $_POST['g-recaptcha-response'] ?? '' ),
		],
	] );
	$result = json_decode( wp_remote_retrieve_body( $response ), true );
}
```

Other keys returned: `category` (the category ID) and the service fields (`containerID`, `trackingID`, `anonymizeIp`, `pixelID`, `siteKey`, `secretKey`, `apiKey`, `piAId`, `piCId`). Switch fields (e.g. `anonymizeIp`) are stored as booleans (`true` / `false`). Settings last saved with an older version may still hold `'on'` when checked, or omit the key when unchecked (the front end then applies the field's default).

### Constants

| Constant | Description |
| --- | --- |
| `CLC_PLUGIN_VERSION` | Plugin version, read from the plugin header. |
| `CLC_PLUGIN_URL` | URL of the plugin directory (trailing slash). |
| `CLC_PLUGIN_PATH` | Filesystem path of the plugin directory (trailing slash). |

### Asset handles

| Handle | Type | Where |
| --- | --- | --- |
| `cookie-law-consent-style` | style | Front end (registered on `init`, enqueued on `wp_enqueue_scripts` priority 5) |
| `cookie-law-consent-js` | script | Front end, loaded in the `<head>` |
| `cookie_law_consent-admin-styles` | style | Settings page only |
| `cookie_law_consent-admin-js` | script | Settings page only |

### Front-end config object

The front-end script reads the global `clc_config` object (output with `wp_localize_script`) and deep-merges it with these defaults ([`src/public/assets/default-config.json`](src/public/assets/default-config.json)):

```json
{
	"banner_position": "bottom-right",
	"cookieName": "cookie-law-consent",
	"hash": "cookie-law-settings",
	"categories": [],
	"texts": { "banner": {}, "modal": {}, "category": {} }
}
```

- `cookieName`: prefix of the consent cookies.
- `hash`: URL hash that opens the preferences modal.

Only when wp-cookie-consent-analytics is active (see [Consent statistics](#consent-statistics)), the config also holds:

- `stats_endpoint`: URL the banner events are sent to (`clc_stats_endpoint` filter);
- `stats_sample_rate`: share of browser sessions whose events are sent (`clc_stats_sample_rate` filter);
- `stats_version`: the installed wp-cookie-consent-analytics version, which decides whether `personalize` carries the `granted` categories.

Without these keys, nothing is sent.

The banner and modal are injected at the start of `<body>` inside a `<div class="cookie-law">` wrapper once `DOMContentLoaded` fires. The `CookieLaw` instance itself is not exposed globally.

### DOM events

The banner dispatches these events on `document`, whether or not the statistics are enabled:

| Event | Dispatched when | `detail` |
| --- | --- | --- |
| `cookielaw:impression` | The banner is shown (on every page load where it shows). | – |
| `cookielaw:accept` | The visitor clicks *Accept all* in the banner. | – |
| `cookielaw:reject` | The visitor clicks *Deny all* in the banner. | – |
| `cookielaw:save` | The visitor saves the preferences modal, first choice or later change. | `{ granted: string[] }`: IDs of the non-mandatory categories now accepted. |

They fire after the choice is applied (consent cookies set, services accepted or rejected). The banner is created on `DOMContentLoaded`, so register your listeners before that, e.g. from a script in the footer:

```js
document.addEventListener("cookielaw:save", (event) => {
	if (event.detail.granted.includes("analytics")) {
		// …
	}
});
```

### CSS hooks

Main BEM blocks you can target when styling: `.cookie-law`, `.cookie-law-banner` (with a `.cookie-law-banner--{position}` modifier), `.cookie-law-modal` and `.cookie-law-category`. Visibility is driven by the `aria-hidden` attribute.

### Translations

The text domain `cookielawconsent` is loaded on `plugins_loaded` from:

1. `wp-content/languages/cookie-law-consent/cookie-law-consent-{locale}.mo` (takes precedence, useful to override strings without touching the plugin);
2. the plugin's [`languages/`](languages/) directory (`cookielawconsent-{locale}.mo`).

A `cookielawconsent.pot` template is provided.

### Uninstall

Deleting the plugin from the WordPress admin runs [`uninstall.php`](uninstall.php), which deletes the `cookie_law_consent` option.

## Development

```bash
nvm use                 # Node 24
yarn install
composer install        # also installs WordPress & Polylang as dev dependencies
```

| Command | Description |
| --- | --- |
| `yarn start` | Starts `webpack-dev-server` and opens [`public/index.html`](public/index.html), a standalone demo page with a sample `clc_config`. |
| `yarn build:dev` | Development build into `dist/`. |
| `yarn build:production` | Production build into `dist/` (minified, content-hashed file names). |
| `yarn watch` | Development build in watch mode. |
| `yarn test` | Runs the front-end tests in [`tests/`](tests/) with Node's built-in test runner. |

### Project structure

```text
cookie-law-consent.php      Plugin bootstrap, constants, i18n & multilingual helpers
uninstall.php               Removes the plugin option (see Uninstall)
src/
├── available-services.php  Service definitions (admin fields)
├── cookie-law-consent-api.php  Public PHP API (cookielawconsent_get_service)
├── admin/
│   ├── settings-page.php   Settings page (Settings API)
│   └── assets/             Admin JS/SCSS (tabs, categories, services UI)
└── public/
    ├── public.php          Front-end asset registration & clc_config
    ├── index.js            Front-end entry point
    └── assets/             Banner, modal, category components, services, styles
languages/                  .pot / .po / .mo files
tests/                      Front-end tests (node --test)
public/                     Dev server demo page
```

Webpack ([`webpack.config.js`](webpack.config.js)) builds two entries, `cookie-law-consent` (front end) and `cookie-law-consent-admin`, and writes a `manifest.json` that PHP uses to resolve the hashed file names.

### Adding a service

Adding a service requires changes in both PHP and JS, followed by a rebuild:

1. Add its definition (name, title, info, fields) to `SERVICES` in `src/available-services.php`.
2. Create `src/public/assets/services/{name}.js` exporting `init` (and optionally `onAccept` / `onReject`), see [Service lifecycle](#service-lifecycle).
3. Register it in `src/public/assets/services/index.js`.

### Releasing

1. Bump the version in `cookie-law-consent.php`, `package.json` and `readme.txt` (`Stable tag`), and update `CHANGELOG.md` and the `readme.txt` changelog.
2. Commit (`chore: 🚀 vX.Y.Z`) and push a `vX.Y.Z` tag. The GitHub workflow builds the assets, publishes the release zip on GitHub and uploads a copy named `cookie-law-consent-vX.Y.Z.zip` to [release-belt](https://release-belt.superhuit.ch). The upload only trusts the SSH host key stored in the `RELEASE_BELT_KNOWN_HOSTS` organization secret, so it fails if that secret is missing or no longer matches the server's key.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

The plugin header declares **GPL-2.0+** ([license text](http://www.gnu.org/licenses/gpl-2.0.txt)).

## Credits

Developed and maintained by [superhuit](https://www.superhuit.ch).

Front-end service integrations are inspired by [tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js).
