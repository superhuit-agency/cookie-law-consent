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
 * @link    https://github.com/Kuuak/cookie-law-consent
 */

namespace CookieLawConsent;

use CookieLawConsent\Admin\SettingsPage;


/* Prevent loading this file directly */
defined( 'ABSPATH' ) || exit;

/**
 * CONSTANTS
 * =================
 * */
const PLUGIN_VERSION = '1.0.0';

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
	wp_register_script( 'cookie-law-consent-js', plugins_url( 'build/public.js', __FILE__ ), null, PLUGIN_VERSION, true );
	wp_localize_script( 'cookie-law-consent-js', 'clc_config', json_decode(get_option( 'json_config' )['json_config_field'], true));
	wp_enqueue_script( 'cookie-law-consent-js' );
}
