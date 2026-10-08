# Cookie Law Consent

> Handle your cookies and give your visitors the ability to accept or refuse them.

**Cookie Law Consent** is a lightweight WordPress plugin by [superhuit](https://www.superhuit.ch) that displays a cookie consent banner and a preferences modal, groups third-party services into cookie categories and stores the visitor's choice for each category. For Google Tag Manager, that choice is passed on as Google Consent Mode v2 signals.

> [!NOTE]
> This branch (`master-v1`) is the **v1.x maintenance line** of the plugin. It only receives fixes and small improvements. New development happens on `master` (v2.x), which differs significantly from what is documented here.

- **Current version:** 1.8.3
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
- Built-in **services**: Google Tag Manager (with Google Consent Mode v2), Google Analytics, Facebook Pixel, Google reCAPTCHA, Google Maps and Salesforce Pardot. Their scripts load on every page view whatever the visitor chose; see [How services are loaded](#how-services-are-loaded).
- All front-end **texts are customizable** from the settings page (banner, modal and per-category labels).
- **Multilingual** support for [WPML](https://wpml.org) and [Polylang](https://wordpress.org/plugins/polylang/): texts are stored per language, while categories enabling and services are shared across languages.
- Any page can re-open the preferences modal with a simple `#cookie-law-settings` link.
- Translations shipped for **French (fr_FR)** and **English (en_GB)**.
- reCAPTCHA **secret key is never exposed** to the front end (since 1.8.2).

## Requirements

| Requirement | Version |
| --- | --- |
| WordPress | 5.0 or higher, tested up to 6.7 (same values as `readme.txt`) |
| PHP | 7.0 or higher (`composer.json`); release builds use PHP 7.4 |
| Node.js *(build only)* | 20.x (`.nvmrc` / `package.json` `engines`) |
| Yarn *(build only)* | 1.22 (`packageManager` in `package.json`) |
| Composer *(build only)* | Any recent version |

## Installation

### From a release zip (recommended)

Every `v*.*.*` tag triggers the [release workflow](.github/workflows/release-plugin.yml), which builds the assets and attaches a ready-to-install `cookie-law-consent.zip` to the corresponding [GitHub release](https://github.com/superhuit-agency/cookie-law-consent/releases).

1. Download `cookie-law-consent.zip` from a **1.x** release (e.g. `v1.8.3`).
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
nvm use            # Node 20
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

| Service | Key | Settings fields | Front-end behaviour (every page view) |
| --- | --- | --- | --- |
| Google Tag Manager | `googletagmanager` | `containerID` (e.g. `GTM-XXX`) | Loads `gtm.js` and sets **Google Consent Mode v2** defaults to `denied` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`), unless a `consent default` entry already exists in `dataLayer`. Sends a `consent update` with `granted` when the category is accepted (also on page load if it was accepted earlier, or always if the category is mandatory) and with `denied` when it is refused after having been accepted during the same page view. |
| Google Analytics | `googleanalytics` | `trackingID` (e.g. `UA-XXXXX-Y`), `anonymizeIp` (switch, default on) | Loads `analytics.js` (Universal Analytics), creates the tracker and sends a pageview. Google has retired Universal Analytics; for GA4, use Google Tag Manager. |
| Facebook Pixel | `facebookpixel` | `pixelID` | Loads `fbevents.js`, then calls `fbq('init', pixelID)` and tracks `PageView`. |
| Google reCAPTCHA | `recaptcha` | `siteKey`, `secretKey` | Loads `https://www.google.com/recaptcha/api.js`. The `secretKey` is stripped from the front-end config. |
| Google Maps | `googlemaps` | `apiKey` | Loads the Maps JavaScript API and renders a map in every element with a `data-gmaps` attribute (see [below](#google-maps-markup)). |
| Pardot | `pardot` | `piAId`, `piCId` | Sets `piAId`, `piCId`, `piHostname` and loads `pd.js`. |

### How services are loaded

> [!IMPORTANT]
> On this branch, consent does **not** block third-party scripts. When the DOM is ready (`DOMContentLoaded`), every enabled service that is assigned to a category runs its `init()` function, and `init()` is what loads the service's script. This happens on every page view, whether the visitor accepted the category, refused it or has not chosen yet.
>
> The visitor's choice is stored in the [consent cookies](#how-consent-is-stored), but only **Google Tag Manager** acts on it: it sets Google Consent Mode v2 defaults to `denied` and updates them when the category is accepted or refused. Google Analytics, Facebook Pixel, reCAPTCHA, Google Maps and Pardot load and run regardless of consent. If you need these services blocked until consent is given, load them through Google Tag Manager and rely on Consent Mode, or handle them yourself.

### Service lifecycle

Each front-end service module may export three functions, all called with the service settings as argument and the main `CookieLaw` instance as `this`:

- `init(data)`: called once on page load (`DOMContentLoaded`) for every service assigned to a category, **whatever the consent state**. It also receives a `callback` to call once the service is ready; that callback runs `onAccept` if the service's category is enabled (mandatory, or accepted earlier).
- `onAccept(data)`: called when the service's category is accepted: on page load (via the `init` callback) if consent was already given, after *Accept all*, or after *Save & Accept* for a category switched on in the modal.
- `onReject(data)`: called when a category that was accepted during the current page view is refused (*Deny all*, or switched off and saved in the modal).

On this branch only **Google Tag Manager** implements `onAccept`/`onReject` (to update the Consent Mode state); the other services only implement `init`.

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

Other keys returned: `category` (the category ID) and the service fields (`containerID`, `trackingID`, `anonymizeIp`, `pixelID`, `siteKey`, `secretKey`, `apiKey`, `piAId`, `piCId`). Switch fields (e.g. `anonymizeIp`) are stored as `'on'` when checked and are absent otherwise.

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

The banner and modal are injected at the start of `<body>` inside a `<div class="cookie-law">` wrapper once `DOMContentLoaded` fires. The `CookieLaw` instance itself is not exposed globally.

### CSS hooks

Main BEM blocks you can target when styling: `.cookie-law`, `.cookie-law-banner` (with a `.cookie-law-banner--{position}` modifier), `.cookie-law-modal` and `.cookie-law-category`. Visibility is driven by the `aria-hidden` attribute.

### Translations

The text domain `cookielawconsent` is loaded on `plugins_loaded` from:

1. `wp-content/languages/cookie-law-consent/cookie-law-consent-{locale}.mo` (takes precedence, useful to override strings without touching the plugin);
2. the plugin's [`languages/`](languages/) directory (`cookielawconsent-{locale}.mo`).

A `cookielawconsent.pot` template is provided.

### Uninstall

Deleting the plugin from the WordPress admin runs [`uninstall.php`](uninstall.php), which is meant to delete the `cookie_law_consent` option.

> [!WARNING]
> Known issue on this branch: `uninstall.php` reads the option name from the `SettingsPage` class, but WordPress does not load the plugin's main file before running `uninstall.php`, so the class is not defined at that point. The uninstall is therefore expected to fail and leave the option in the database. You can remove it manually, e.g. with `wp option delete cookie_law_consent`.

## Development

```bash
nvm use                 # Node 20
yarn install
composer install        # also installs WordPress & Polylang as dev dependencies
```

| Command | Description |
| --- | --- |
| `yarn start` | Starts `webpack-dev-server` and opens [`public/index.html`](public/index.html), a standalone demo page with a sample `clc_config`. |
| `yarn build:dev` | Development build into `dist/`. |
| `yarn build:production` | Production build into `dist/` (minified, content-hashed file names). |
| `yarn watch` | Development build in watch mode. |

### Project structure

```text
cookie-law-consent.php      Plugin bootstrap, constants, i18n & multilingual helpers
uninstall.php               Meant to remove the plugin option (see Uninstall)
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
2. Commit (`chore: 🚀 vX.Y.Z`) and push a `vX.Y.Z` tag. The GitHub workflow builds the assets and publishes the release zip.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

The plugin header declares **GPL-2.0+** ([license text](http://www.gnu.org/licenses/gpl-2.0.txt)).

## Credits

Developed and maintained by [superhuit](https://www.superhuit.ch).

Front-end service integrations are inspired by [tarteaucitron.js](https://github.com/AmauriC/tarteaucitron.js).
