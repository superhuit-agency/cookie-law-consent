# Change Log

All notable changes to this project will be documented in this file.
Inspired by: [keepachangelog.com](http://keepachangelog.com/)

# Change History

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
