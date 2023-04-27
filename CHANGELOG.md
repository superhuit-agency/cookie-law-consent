# Change Log
All notable changes to this project will be documented in this file.
Inspired by: [keepachangelog.com](http://keepachangelog.com/)

# Change History

# [2.1.0] - 2023-04-27
- Move repo to Github
- Adapt project stack & structure to Github
- Add CI release workflow
- Upgrade node version in stack to v14
- Fix #1: undefined array key language
- Minor fixes

# [2.0.2] - 2022-03-17
## Added
- Google Maps service
- Expose configs to the settings REST API

# [2.0.1] - 2022-01-11
## Fixed
- Get GDPR configs even if no services are configured (we can still need it for necessary cookies)

## [2.0.0] - 2021-12-03
⚠️ This is a breaking change in how the plugin works. Please be sure to understand the changes before to update.

In this 2.0.0 version the plugin does not handle anymore the front-end part. It is only the configuration in WP Backend
### Removed
- Frontend code
- ReCaptcha service
### Added
- Graphql support (instead of global variable)
### Fix
- Language variable to get category texts

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
