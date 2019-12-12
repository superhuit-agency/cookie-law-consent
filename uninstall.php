<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package Woo_Default_Attributes
 * @author  Kuuak
 * @license GPL-2.0+
 * @link    https://gitlab.com/superhuit/cookie-law-consent
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Delete options
delete_option( 'json_config' );
