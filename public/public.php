<?php

namespace CookieLawConsent\Frontend;

use CookieLawConsent\Admin\SettingsPage;

use function CookieLawConsent\is_multilingual;
use function CookieLawConsent\get_translated_text;

/**
 * ACTIONS & FILTERS
 * =================
 *
 * Register the actions & filters
 */
add_action( 'init', __NAMESPACE__.'\register_assets');

function register_assets() {
	wp_register_style( 'cookie-law-consent-style', plugins_url( 'cookie-law-consent.css', __FILE__ ), CLC_PLUGIN_VERSION );
	wp_register_script( 'cookie-law-consent-js', plugins_url( 'cookie-law-consent.js', __FILE__ ), null, CLC_PLUGIN_VERSION, true );
}


/**
 * Register cookie law consent configs in GraphQL
 */
add_action( 'graphql_register_types', function() {
	register_graphql_field( 'RootQuery', 'gdpr', [
		'type' => 'String',
		'description' => __( 'Cookie Law Consent configs', 'cookielawconsent' ),
		'args' => [
			'language' => [
				'type' => is_multilingual() ? 'LanguageCodeEnum' : 'String'
			]
		],
		'resolve' => __NAMESPACE__.'\get_configs_json'
	]);
});

function get_configs_json($source, $args, $context, $info) {
	$config = get_option( SettingsPage::SETTINGS_NAME );

	$config['texts'] = [
		'banner' => get_banner_texts(get_translated_text($config[SettingsPage::FIELD_BANNER_TEXTS], $args['language'] ?? null)),
		'modal' => get_modal_texts(get_translated_text($config[SettingsPage::FIELD_MODAL_TEXTS], $args['language'] ?? null)),
	];

	$config[SettingsPage::FIELD_CATEGORIES] = array_map(function($cat) use ($args) {
		$cat['title'] = get_translated_text($cat['title'] ?? '', $args['language'] ?? null);
		$cat['description'] = get_translated_text($cat['description'] ?? '', $args['language'] ?? null);
		$cat['texts'] = get_category_texts(get_translated_text($cat['texts'] ?? '', $args['language'] ?? null));

		return $cat;
	}, $config[SettingsPage::FIELD_CATEGORIES]);

	foreach ($config[SettingsPage::FIELD_CATEGORIES] as $i => $cat) {
		$services = array_filter(
			$config[SettingsPage::FIELD_SERVICES],
			function($srv) use ($cat){
				return ( isset($srv['category']) && $srv['category'] === $cat['id'] );
			}
		);

		foreach ($services as $name => $service) {
			$service['name'] = $name;
			unset($service['enabled']);
			unset($service['category']);
			$config['categories'][$i][SettingsPage::FIELD_SERVICES][] = $service;
		}
	}

	unset($config[SettingsPage::FIELD_SERVICES]);
	unset($config[SettingsPage::FIELD_BANNER_TEXTS]);
	unset($config[SettingsPage::FIELD_MODAL_TEXTS]);

	return json_encode($config);
}

function get_category_texts( $texts = [] ) : Array {
	return array_merge( [
		'enable'        => __( 'Enable cookies', 'cookielawconsent' ),
		'enabled'       => __( 'Enabled', 'cookielawconsent' ),
		'disable'       => __( 'Disable cookies', 'cookielawconsent' ),
		'disabled'      => __( 'Disabled', 'cookielawconsent' ),
		'alwaysEnabled' => __( 'Always enabled', 'cookielawconsent' ),
	], (is_array($texts) ? $texts : []) );
}
function get_banner_texts( $texts = [] ) : Array {
	return array_merge( [
		'title'       => _x('Cookies', 'Banner Title', 'cookielawconsent' ),
		'acceptAll'   => _x('Accept', 'Banner Accept All', 'cookielawconsent' ),
		'message'     => _x('This site uses cookies to help improve your user experience and gives you control over what you want to activate.', 'Banner Message', 'cookielawconsent' ),
		'rejectAll'   => _x('Reject', 'Banner Reject All', 'cookielawconsent' ),
		'personalize' => _x('Personalize', 'Banner Personalize', 'cookielawconsent' ),
	], (is_array($texts) ? $texts : []) );
}
function get_modal_texts( $texts = [] ) : Array {
	return array_merge( [
		'title'       => _x('Cookie Settings', 'Modal Title', 'cookielawconsent' ),
		'close'       => _x('Close', 'Modal Personalize', 'cookielawconsent' ),
		'description' => _x('This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.', 'Modal Description', 'cookielawconsent' ),
		'save'        => _x('Save & Accept', 'Modal Accept All', 'cookielawconsent' ),
	], (is_array($texts) ? $texts : []) );
}
