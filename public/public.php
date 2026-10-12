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
	$option = get_option( SettingsPage::SETTINGS_NAME );

	// Until the settings page is saved once, the option only holds the hash and the categories,
	// and it can be missing altogether. Fill in the missing keys so the output keeps its shape.
	$config = array_merge(
		[
			SettingsPage::FIELD_HASH       => SettingsPage::DEFAULT_HASH,
			SettingsPage::FIELD_CATEGORIES => [],
		],
		is_array($option) ? $option : []
	);
	if ( !is_array($config[SettingsPage::FIELD_CATEGORIES]) ) $config[SettingsPage::FIELD_CATEGORIES] = [];
	$all_services = is_array($config[SettingsPage::FIELD_SERVICES] ?? null) ? $config[SettingsPage::FIELD_SERVICES] : [];

	$config['texts'] = [
		'banner' => get_banner_texts(get_translated_text($config[SettingsPage::FIELD_BANNER_TEXTS] ?? [], $args['language'] ?? null)),
		'modal' => get_modal_texts(get_translated_text($config[SettingsPage::FIELD_MODAL_TEXTS] ?? [], $args['language'] ?? null)),
	];

	$config[SettingsPage::FIELD_CATEGORIES] = array_map(function($cat) use ($args) {
		$cat['title'] = get_translated_text($cat['title'] ?? '', $args['language'] ?? null);
		$cat['description'] = get_translated_text($cat['description'] ?? '', $args['language'] ?? null);
		$cat['texts'] = get_category_texts(get_translated_text($cat['texts'] ?? '', $args['language'] ?? null));

		return $cat;
	}, $config[SettingsPage::FIELD_CATEGORIES]);

	foreach ($config[SettingsPage::FIELD_CATEGORIES] as $i => $cat) {
		$services = array_filter(
			$all_services,
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
