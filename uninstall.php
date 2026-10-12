<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package CookieLawConsent
 * @author  Kuuak
 * @license GPL-2.0+
 * @link    https://github.com/superhuit-agency/cookie-law-consent
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Delete options.
// WordPress does not load the plugin's main file before running uninstall.php,
// so plugin classes (e.g. SettingsPage::SETTINGS_NAME) are not available here.
delete_option( 'cookie_law_consent' );
