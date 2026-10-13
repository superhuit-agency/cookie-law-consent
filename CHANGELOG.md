# Change Log

All notable changes to this project will be documented in this file.
Inspired by: [keepachangelog.com](http://keepachangelog.com/)

# Change History

# [Unreleased]

# [1.9.0] - 2026-10-13

- fix: 🐛 Google Tag Manager: push the Consent Mode `consent default` (with `wait_for_update: 500`) and a returning visitor's `consent update` before the `gtm.js` event
- feat: ✨ Google Tag Manager: push a `clc_consent_granted` dataLayer event when the visitor accepts during the page view, to re-send the landing page_view with consent
- fix: 🐛 Google Tag Manager: push a `consent update` denied when the visitor refuses on the first visit
- feat: ✨ Send consent statistics (banner impressions, accept, reject, personalize) to [wp-cookie-consent-analytics](https://github.com/superhuit-agency/wp-cookie-consent-analytics) when it is active, with the `clc_stats_endpoint` and `clc_stats_sample_rate` filters. Granted categories are sent to wp-cookie-consent-analytics 1.1.0 and later.
- feat: ✨ Dispatch `cookielaw:impression`, `cookielaw:accept`, `cookielaw:reject` and `cookielaw:save` DOM events on `document`
- fix: 🐛 Only load services once their category is consented (Google Tag Manager still loads before consent, with Consent Mode v2 denied defaults) (#27)
- fix: 🐛 Save every toggled category from the preferences modal, not only the last one (#21)
- fix: 🐛 Closing the preferences modal restores the last saved consent (#30)
- fix: 🐛 Escape closes the preferences modal; the banner is named by its heading (#47)
- fix: ♿️ Move focus out of the banner/modal before hiding them, and make them inert while hidden (#31)
- fix: 🐛 getCookie() matches the exact cookie name and returns the whole value (#46)
- fix: 🐛 Google Analytics "Anonymize IP" switch can be turned off (#22)
- fix: 🐛 Keep language-keyed texts as they are when the stored option is sanitized again (#67)
- fix: 🐛 Move flat texts under the default language on the first multilingual save (#52)
- fix: 🐛 sanitize() no longer crashes on the default settings or on its own output (#32)
- fix: 🔒 Escape stored values on the settings page and sanitize service fields (#51)
- fix: 🐛 No PHP warning on the settings page when a saved service lacks a field (#29)
- fix: 🐛 Uninstall fatal error ("SettingsPage" class not found); the option is now deleted (#20)
- fix: 🔒 Update vulnerable transitive build dependencies (yarn.lock only) (#77)

# [1.8.3] - 2025-03-21

fix: 🐛 potential undefinned services key

# [1.8.2] - 2025-03-19

- fix: 🐛 services functions. regreation #bf257f798d5a5722f736faef0f3d87472b2e6042
- fix: 🔒 Avoid recaptcha secret key leak in JS

# [1.8.1] - 2025-02-04

- feat: 🌐 Update languages for new Deny all button
- fix: 🐛 Display all fields in Section texts settings

# [1.8.0] - 2025-02-04

- feat: ✨ Add "Deny all" button

# [1.7.3] - 2025-01-16

- fix: 🐛 Consent Mode v2 not corectly setup
- fix: 🐛 Include main script in head and earlier

# [1.7.2] - 2025-01-10

- fix: 🚑 One more fix on the Google Consent Mode v2

# [1.7.1] - 2024-12-20

- fix: 🚑 Consent mode v2 not correctly executed

# [1.7.0] - 2024-12-19

- feat: ✨ Consent Mode v2
- refactor: ♻️ refactor services for init, accept & reject callbacks
- chore: ⬆️ upgrade dependencies & restructure plugin files (node 20, webpack 5, project structure)
- chore: 🔧 Improve dev index.html
- fix: 🐛 Only load accepted services when "save & accept" button is clicked

# [1.6.0] - 2023-04-27

- Move repo to Github
- Adapt project stack & structure to Github
- Add CI release workflow
- Upgrade node version in stack to v14
- Minor fixes

# [1.5.0] - 2022-06-28

## Add

- Pardot service

## Change

- Assets name to include hash to improve cache invalidation

## Fix

- Modal category toggle style

# [1.4.1] - 2022-04-14

## Fix

- Banner hidden/show initial style logic

# [1.4.0] - 2022-02-08

## Add

- Google Maps service

## [1.3.1] - 2021-09-03

### Fix

- Services in mandatory category not loaded
- Plugin version constant not correctly set

## [1.3.0] - 2021-09-01

### Add

- API function `cookielawconsent_get_service`

## [1.2.3] - 2021-08-05

### Fix

- Improve cookies helper functions
- Fix Banner cookie set & get

### Add

- Filter `clc_config` to filter the array

## [1.2.2] - 2021-02-18

### Add

- Composer config file

## [1.2.1] - 2021-02-11

### Fixed

- Typo in FR translations

## [1.2.0] - 2021-02-10

### Added

- Polylang support for multilingual sites

### Fixed

- Fix attribute on cookie-law-modal:title thanks to @luisbraga
- Improved FR translations
