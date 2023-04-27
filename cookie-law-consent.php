<?php
/**
 * Plugin Name: Cookie Law Consent
 * Description: Handle your Cookies and give the user the ability to Accept or not the cookies.
 * Version:     2.0.2
 * Author:  superhuit
 * Author URI:  https://profiles.wordpress.org/superhuit
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: cookielawconsent
 * Domain Path: /languages
 *
 * Cookie Law Consent is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation.  You may NOT assume
 * that you can use any other version of the GPL.
 *
 * Cookie Law Consent is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package CookieLawConsent
 * @author  Kuuak
 * @license GPL-2.0+
 * @link    https://gitlab.com/superhuit/cookie-law-consent
 */
namespace CookieLawConsent;

use CookieLawConsent\Admin\SettingsPage;


/* Prevent loading this file directly */
defined( 'ABSPATH' ) || exit;

$plugin_data = get_file_data( __FILE__, ['version' => 'Version']);

/**
 * CONSTANTS
 * =================
 * */
define( 'CLC_PLUGIN_PATH', __DIR__ );
define( 'CLC_PLUGIN_URL', plugin_dir_url(__FILE__) );
define( 'CLC_PLUGIN_VERSION', $plugin_data['version'] );

require_once __DIR__ .'/available-services.php';
require_once __DIR__ .'/public/public.php';
require_once __DIR__ .'/admin/settings-page.php';
require_once __DIR__ .'/cookie-law-consent-api.php';

/**
 * ACTIONS & FILTERS
 * =================
 *
 * Register the actions & filters
 */
register_activation_hook( __FILE__, __NAMESPACE__ .'\plugin_activation' );
add_action( 'plugins_loaded', __NAMESPACE__.'\register_textdomain' );
add_action( 'rest_api_init', __NAMESPACE__.'\register_settings_api_rest' );

function plugin_activation() {
	SettingsPage::insert_default_settings();
}


if( is_admin() ) new SettingsPage();

/**
 * Register the plugin text domain
 *
 * @global WP_LANG_DIR
 */
function register_textdomain() {
	load_textdomain( 'cookielawconsent', WP_LANG_DIR .'/cookie-law-consent/cookie-law-consent-' . get_locale() . '.mo' );
	load_plugin_textdomain( 'cookielawconsent', false, dirname(plugin_basename(__FILE__)) . '/languages/' );
}

function register_settings_api_rest() {
	$config = get_option( SettingsPage::SETTINGS_NAME );

	register_setting(
		'general',
		'cookielawconsent',
		[
			'type'         => 'string',
			'show_in_rest' => true,
			'default' 		 => json_encode($config) // Need to stringify otherwise it doesn't work to send object directly..
		],
	);
}


function is_multilingual() {
	return ( is_wpml() || is_polylang() ) ;
}

function is_wpml() {
	return class_exists( 'SitePress' );
}

function is_polylang() {
	return defined( 'POLYLANG' );
}

function get_current_lang() {
	$currentLang = null;

	if ( is_multilingual() )       {
		$currentLang =  (is_wpml()
			? apply_filters( 'wpml_current_language', NULL ) // WPML
			: pll_current_language() // Polylang
		);
		$defaultLang = get_default_lang();
		$currentLang = ( $currentLang === 'all' ? $defaultLang : $currentLang );
	}

	return $currentLang;
}

function get_default_lang() {
	$defaultLang = null;

	if ( is_multilingual() ) {
		$defaultLang = (is_wpml()
			? apply_filters( 'wpml_default_language', NULL ) // WPML
			: pll_default_language() // Polylang
		);
	}

	return $defaultLang;
}

function get_translated_text ($translations, $language = null) {
	if ( !(is_multilingual() && is_array($translations)) ) return $translations;

	$currentLang = $language ?? get_current_lang();
	$defaultLang = get_default_lang();

	if ( isset($translations[$currentLang]) ) $text = $translations[$currentLang];
	else if ( isset($translations[$defaultLang]) ) $text = $translations[$defaultLang];
	else $text = array_shift($translations);

	return $text;
}

function get_language_full_name() {
	$fullname = '';

	if ( is_multilingual() ) {
		$current_lang = get_current_lang();
		if ( is_wpml() ) {
			$fullname = apply_filters( 'wpml_translated_language_name', NULL, $current_lang );
		}
		elseif ( is_polylang() ){
			$idx = array_search($current_lang, pll_languages_list());
			$fullname = pll_languages_list([ 'fields' => 'name' ])[$idx];
		}
	}

	return $fullname;
}


