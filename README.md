# Cookie Law Consent

Handle your cookies and give the user the ability to accept them or not.

Cookie Law Consent is a WordPress plugin that stores the **configuration** of a GDPR cookie consent solution in the WordPress back office: banner and modal texts, cookie categories and third-party services (Google Tag Manager, Google Analytics 4, Facebook Pixel, Google Maps).

> **Since v2.0.0 the plugin no longer renders anything on the front end.** It only provides the settings page and exposes the configuration through [WPGraphQL](https://www.wpgraphql.com/), the WordPress REST API and a PHP helper function. The cookie banner/modal itself must be implemented by your theme or headless front end. See the [2.0.0 changelog entry](CHANGELOG.md) for details.

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available services](#available-services)
- [Developer reference](#developer-reference)
- [Development](#development)
- [Changelog](#changelog)
- [License](#license)
- [Credits](#credits)

## Features

- Settings page under **Settings > Cookie Law Consent**.
- Customizable **banner texts** (title, description, accept all, reject all, personalize) and **modal texts** (title, description, close, save).
- **Cookie categories** with position, a "mandatory" flag, title, description and per-category custom texts (enable / enabled / disable / disabled / always enabled). Two categories are created on activation: *Necessary* (mandatory) and *Analytics*. New categories cannot be added from the settings page.
- **Third-party services** that can be enabled, assigned to a category and configured (IDs / API keys).
- A configurable **hash** (default `manage-cookies`) meant to be used by the front end to reopen the consent modal from any link pointing to `#<hash>`.
- **Multilingual** support with [WPML](https://wpml.org/) and [Polylang](https://polylang.pro/): texts are stored per language, while choices and enabled services are shared across languages.
- Configuration exposed via **WPGraphQL** (`gdpr` root field), the **REST API** (`/wp/v2/settings`) and the PHP function `cookielawconsent_get_service()`.
- Translations shipped for **French (fr_FR)** and **English (en_GB)**.

## Requirements

| Requirement | Version |
| --- | --- |
| WordPress | 5.0 or later (not enforced in the plugin header) |
| PHP | 7.3 or later (the code uses trailing commas in function calls) |
| [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) | Optional, needed for the `gdpr` GraphQL field |
| WPML or Polylang | Optional, for multilingual texts |
| A WPGraphQL language extension (for example [WPGraphQL for Polylang](https://github.com/valu-digital/wp-graphql-polylang)) | Required on multilingual sites that use the `gdpr` GraphQL field: it must register the `LanguageCodeEnum` type used by the `language` argument |

To build from source you also need Node.js 14 (see `.nvmrc` / `package.json` `engines`), Yarn and, optionally, Composer.

## Installation

### From a release zip

1. Download `cookie-law-consent.zip` from the [GitHub releases](https://github.com/superhuit-agency/cookie-law-consent/releases). It is built automatically by the release workflow and already contains the compiled admin assets.
2. In WordPress go to **Plugins > Add New > Upload Plugin**, select the zip and click **Install Now**.
3. Activate **Cookie Law Consent**.

### With Composer

The package is declared as a `wordpress-plugin` (`superhuit/cookie-law-consent`) and uses `composer/installers`. Add the GitHub repository to your project's `composer.json`:

```json
{
  "repositories": [
    { "type": "vcs", "url": "https://github.com/superhuit-agency/cookie-law-consent" }
  ],
  "require": {
    "superhuit/cookie-law-consent": "^2.2"
  }
}
```

The `dist/` folder is not committed, so after a Composer install from source you must build the admin assets (see below), or use the release zip instead.

### From source

```bash
cd wp-content/plugins
git clone https://github.com/superhuit-agency/cookie-law-consent.git
cd cookie-law-consent

nvm use            # Node 14 (lts/fermium)
yarn install
yarn build:production
```

Then activate the plugin in **Plugins**.

## Configuration

On activation the plugin creates the `cookie_law_consent` option with the default hash and the *Necessary* and *Analytics* categories. The texts and services keys are only added the first time the settings page is saved, so save it once after activation (see [GraphQL](#graphql)).

Go to **Settings > Cookie Law Consent** (requires the `manage_options` capability). The page has four sections:

1. **Appearance**: the **Hash**. The front end can open the consent modal from any link whose URL is this hash prefixed with `#` (for example `<a href="#manage-cookies">`).
2. **Custom texts**: banner and modal texts. Empty fields fall back to the translated defaults when the configuration is read through GraphQL (see the [`gdpr` output](#graphql)).
3. **Categories**: one tab per category with *Position*, *Mandatory?*, *Title*, *Description* and custom texts. A category with an empty title is removed on save, and it cannot be added back from the settings page (the "add category" button is disabled in the code). Categories are sorted by position.
4. **Services**: one tab per available service. When **Enable?** is switched on, its category and fields become required. Only enabled services are saved.

On a multilingual site (WPML or Polylang), the page shows which language you are editing. Switch the admin language to translate the texts; categories, positions, mandatory flags and services apply to all languages.

## Available services

Services are declared in `available-services.php` (`CookieLawConsent\SERVICES`).

| Service | `name` key | Fields |
| --- | --- | --- |
| Google Tag Manager | `googletagmanager` | `containerID` (for example `GTM-XXX`) |
| Google Analytics 4 | `googleanalytics` | `propertyID` (for example `G-XXX`) |
| Facebook Pixel | `facebookpixel` | `pixelID` |
| Google Maps | `googlemaps` | `apiKey` |

Each enabled service is also given a `category` (the `id` of one of the configured categories).

## Developer reference

The plugin does not register any custom actions, filters or shortcodes, and loads no front-end script. Your front end reads the configuration through one of the interfaces below and is responsible for showing the banner, storing consent and loading the services.

### Stored option

All settings are stored in a single option named `cookie_law_consent` (`CookieLawConsent\Admin\SettingsPage::SETTINGS_NAME`):

```php
[
  'hash'         => 'manage-cookies',
  'banner_texts' => [ 'title' => '…', 'message' => '…', 'acceptAll' => '…', 'rejectAll' => '…', 'personalize' => '…' ],
  'modal_texts'  => [ 'title' => '…', 'description' => '…', 'close' => '…', 'save' => '…' ],
  'categories'   => [
    [
      'id'          => 'necessary',
      'position'    => 1,
      'mandatory'   => true,
      'title'       => 'Necessary',
      'description' => '…',
      'texts'       => [ 'enable' => '…', 'enabled' => '…', 'disable' => '…', 'disabled' => '…', 'alwaysEnabled' => '…' ], // optional
    ],
    // …
  ],
  'services'     => [
    'googletagmanager' => [ 'enabled' => 'on', 'category' => 'analytics', 'containerID' => 'GTM-XXX' ],
    // …
  ],
]
```

On multilingual sites, `banner_texts`, `modal_texts` and each category's `title`, `description` and `texts` are arrays keyed by language code (for example `[ 'en' => '…', 'fr' => '…' ]`).

### PHP: `cookielawconsent_get_service()`

```php
cookielawconsent_get_service( $name )
```

`$name` is a service `name` key (see [Available services](#available-services)). The function is declared in the global namespace and has no type declarations. It returns an array: the saved configuration of a service, with `enabled` cast to a boolean. If the service was never saved, it returns `[ 'enabled' => false ]`.

```php
$gtm = cookielawconsent_get_service( 'googletagmanager' );

if ( $gtm['enabled'] ) {
	// $gtm = [ 'enabled' => true, 'category' => 'analytics', 'containerID' => 'GTM-XXX' ]
	printf( '<!-- GTM container: %s -->', esc_html( $gtm['containerID'] ) );
}
```

### GraphQL

When WPGraphQL is active, the plugin registers a `gdpr` field on `RootQuery`. It returns the configuration as a **JSON string**.

```graphql
query {
  gdpr                    # single-language site: language is a String and is optional
}

query {
  gdpr(language: FR)      # WPML / Polylang: language is a LanguageCodeEnum
}
```

On a WPML or Polylang site the `LanguageCodeEnum` type is not registered by this plugin: it must come from a WPGraphQL language extension (see [Requirements](#requirements)). If `language` is omitted, the current language is used, then the default language, then the first available translation.

The resolver expects the `services` key to exist in the option. It is only created when the settings page is saved, so before that first save the query fails on PHP 8 (`array_filter()` receives `null`). Save the settings page once after activation.

Decoded output:

```json
{
  "hash": "manage-cookies",
  "categories": [
    {
      "id": "necessary",
      "position": 1,
      "mandatory": true,
      "title": "Necessary",
      "description": "…",
      "texts": {
        "enable": "Enable cookies",
        "enabled": "Enabled",
        "disable": "Disable cookies",
        "disabled": "Disabled",
        "alwaysEnabled": "Always enabled"
      }
    },
    {
      "id": "analytics",
      "position": 2,
      "mandatory": false,
      "title": "Analytics",
      "description": "…",
      "texts": { "…": "…" },
      "services": [
        { "name": "googleanalytics", "propertyID": "G-XXX" }
      ]
    }
  ],
  "texts": {
    "banner": { "title": "…", "acceptAll": "…", "message": "…", "rejectAll": "…", "personalize": "…" },
    "modal":  { "title": "…", "close": "…", "description": "…", "save": "…" }
  }
}
```

- Missing texts are filled with the plugin's translated defaults.
- Enabled services are grouped under the category they are assigned to (`services` key), without their `enabled` and `category` keys. Categories without services have no `services` key.

Example (JavaScript):

```js
const res = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: '{ gdpr }' }),
});
const { data } = await res.json();
const config = JSON.parse(data.gdpr);
```

### REST API

On `rest_api_init` the plugin registers a `cookielawconsent` setting (type `string`, `show_in_rest`) in the `general` group. Its default value is the JSON-encoded raw `cookie_law_consent` option, so it is available on the core settings endpoint:

```http
GET /wp-json/wp/v2/settings
```

```json
{
  "…": "…",
  "cookielawconsent": "{\"hash\":\"manage-cookies\",\"categories\":[…],\"services\":{…}}"
}
```

The core `/wp/v2/settings` endpoint requires an authenticated user with the `manage_options` capability. Unlike the GraphQL field, this value is the raw stored option: texts are not translated or filled with defaults, and services are not grouped by category.

### Multilingual helpers

`cookie-law-consent.php` defines helper functions in the `CookieLawConsent` namespace that the plugin uses internally: `is_multilingual()`, `is_wpml()`, `is_polylang()`, `get_current_lang()`, `get_default_lang()`, `get_translated_text( $translations, $language = null )` and `get_language_full_name()`.

### Constants

| Constant | Value |
| --- | --- |
| `CLC_PLUGIN_PATH` | Absolute path to the plugin directory |
| `CLC_PLUGIN_URL` | URL of the plugin directory |
| `CLC_PLUGIN_VERSION` | Plugin version read from the plugin header |

### Uninstall

`uninstall.php` is meant to delete the `cookie_law_consent` option when the plugin is deleted from the WordPress admin. It references `CookieLawConsent\Admin\SettingsPage::SETTINGS_NAME`, but WordPress does not load the plugin's main file when it runs `uninstall.php`, so the class is not defined and uninstall will most likely fail with a fatal error. Until this is fixed, remove the option manually if needed, for example with `wp option delete cookie_law_consent`.

## Development

```bash
nvm use                  # Node 14 (lts/fermium)
yarn install

yarn build:dev           # development build to dist/
yarn watch               # rebuild on change
yarn build:production    # minified production build
```

Webpack compiles `admin/src/index.js` (and its SCSS) to `dist/cookie-law-consent-admin.js` and `dist/cookie-law-consent-admin.css`. They are only enqueued on the plugin's settings page. `dist/` is git-ignored.

Project structure:

```text
cookie-law-consent.php      Plugin bootstrap, constants, REST setting, multilingual helpers
cookie-law-consent-api.php  Public PHP API (cookielawconsent_get_service)
available-services.php      List of supported services and their fields
admin/settings-page.php     Settings page (SettingsPage class)
admin/src/                  Admin JS & SCSS sources
public/public.php           WPGraphQL "gdpr" field and default texts
languages/                  fr_FR and en_GB translations (text domain: cookielawconsent)
uninstall.php               Removes the plugin option on uninstall
```

### Adding a service

Add an entry to `CookieLawConsent\SERVICES` in `available-services.php`:

```php
[
	'name'     => 'myservice',          // key used in the option, the API and GraphQL
	'title'    => 'My Service',         // tab label
	'info'     => '',                   // optional help text (HTML allowed)
	'enabled'  => false,
	'category' => null,
	'fields'   => [
		// 'type' is used as the <input> type; 'switch' renders a toggle instead
		[ 'type' => 'text', 'name' => 'apiKey', 'label' => 'API Key', 'placeholder' => 'XXX' ],
	],
],
```

### Releasing

Pushing a tag matching `v*.*.*` runs `.github/workflows/release-plugin.yml`. It installs Composer dependencies (`--no-dev`), runs `yarn install --frozen-lockfile` and `yarn build:production`, zips the plugin without development files, and publishes `cookie-law-consent.zip` as a GitHub release. Bump the version in `cookie-law-consent.php`, `package.json` and `readme.txt` (`Stable tag`), and update `CHANGELOG.md`, before tagging.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

Licensed under the GPL-2.0+ license, as declared in the plugin header (`cookie-law-consent.php`). See <http://www.gnu.org/licenses/gpl-2.0.txt>.

## Credits

Developed and maintained by [superhuit](https://www.superhuit.ch) (<tech@superhuit.ch>).
