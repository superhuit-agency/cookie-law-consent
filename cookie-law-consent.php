<?php
/**
 * Plugin Name: Cookie Law Consent
 * Description: Handle your Cookies and give the user the ability to Accept or not the cookies.
 * Version:     1.0.0
 * Author URI:  https://profiles.wordpress.org/kuuak
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: clc
 * Domain Path: cookielawconsent
 *
 * Cookie Law Consent is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation.  You may NOT assume
 * that you can use any other version of the GPL.
 *
 * Cookie Law Consent is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package Woo_Default_Attributes
 * @author  Kuuak
 * @license GPL-2.0+
 * @link    https://gitlab.com/superhuit/cookie-law-consent
 */

namespace CookieLawConsent;

use CookieLawConsent\Admin\SettingsPage;

/* Prevent loading this file directly */
defined( 'ABSPATH' ) || exit;

/**
 * CONSTANTS
 * =================
 * */
define( 'CLC_PLUGIN_VERSION', '1.0.0' );

require_once __DIR__ .'/available-services.php';
require_once __DIR__ .'/admin/settings-page.php';

if( is_admin() ) new SettingsPage();

/**
 * ACTIONS & FILTERS
 * =================
 *
 * Register the actions & filters
 */
add_action( 'wp_enqueue_scripts', __NAMESPACE__.'\enqueue_assets');

function enqueue_assets() {
	$config = get_option( SettingsPage::SETTINGS_NAME );


	// Bail early as no services is configured
	if ( count($config[SettingsPage::FIELD_SERVICES]) === 0 ) return;

	foreach ($config['categories'] as $i => $category) {
		$services = array_filter(
			$config[SettingsPage::FIELD_SERVICES],
			function($srv) use ($category){
				return ( $srv['category'] === $category['name'] );
			}
		);

		foreach ($services as $name => $service) {
			$service['name'] = $name;
			unset($service['enabled']);
			unset($service['category']);
			$config['categories'][$i][SettingsPage::FIELD_SERVICES][] = $service;
		}
	}

	if (!$config[SettingsPage::FIELD_EXTERNAL_STYLES]) {
		wp_enqueue_style( 'cookie-law-consent-styles', plugins_url( 'build/cookie-law-consent.css', __FILE__ ), CLC_PLUGIN_VERSION );
	}

	unset($config[SettingsPage::FIELD_SERVICES]);
	unset($config[SettingsPage::FIELD_EXTERNAL_STYLES]);

	wp_register_script( 'cookie-law-consent-js', plugins_url( 'build/cookie-law-consent.js', __FILE__ ), null, CLC_PLUGIN_VERSION, true );
	wp_localize_script( 'cookie-law-consent-js', 'clc_config', json_encode($config));
	wp_enqueue_script( 'cookie-law-consent-js' );


}
