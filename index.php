<?php
/**
 * @wordpress-plugin
 * Plugin Name:         Sixa - Add to Cart
 * Description:         Add to Cart block for WordPress editor.
 * Version:             0.1.0
 * Requires at least:   5.7
 * Requires PHP:        7.2
 * Author:              sixa AG
 * License:             GPL-3.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:         sixa
 *
 * @package             sixa
 */

namespace SixaAddToCartBlock;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function register_block() {
	// Bail early in case WooCommerce is not being activated.
	if ( ! is_woocommerce() ) {
		return;
	}

	register_block_type_from_metadata(
		__DIR__,
		array(
			'render_callback' => function( $attributes, $content ) {
				$return = add_attributes( $attributes, $content );
				// Return the modified content of the block’s output.
				return $return;
			},
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

/**
 * Add extra parameters to the WooCommerce product (endpoint) response.
 *
 * @since   1.0.0
 * @param   WP_REST_Response $response        The response object.
 * @param   WP_Post|WC_Data  $post            Post object or WC object.
 * @return  WP_REST_Response
 */
function prepare_product( $response, $post ) {
	$product_id                   = is_callable( array( $post, 'get_id' ) ) ? $post->get_id() : ( ! empty( $post->ID ) ? $post->ID : null );
	$product                      = wc_get_product( $product_id );
	$response->data['stock_html'] = wc_get_stock_html( $product );

	return $response;
}
add_filter( 'woocommerce_rest_prepare_product_object', __NAMESPACE__ . '\prepare_product', 10, 2 );

/**
 * Sets generated product attributes with name qualifiedName to the given value. If the attribute does not exist, it will be created.
 *
 * @param   array $attributes        Product id.
 * @param   mixed $content           Block’s HTML content/output.
 * @return  mixed
 */
function add_attributes( $attributes, $content ) {
	$product_id = $attributes['postId'] ?? '';
	// Bail early, in case the product id is missing.
	if ( ! $product_id ) {
		return $content;
	}

	$class = 'wp-block-sixa-add-to-cart';
	$dom   = new \DOMDocument();
	// Loads an XML document from the given form content (string).
	$dom->loadXML( $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
	$xpath           = new \DomXPath( $dom );
	$button_node     = $xpath->query( '//a' );
	$product         = wc_get_product( $product_id );
	$display_price   = $attributes['displayPrice'] ?? false;
	$display_stock   = $attributes['displayStock'] ?? false;
	$custom_classes  = array( 'class' => $button_node->item( 0 )->getAttribute( 'class' ) );
	$html_attributes = get_attributes( $product, $custom_classes );

	// Get the product price in html format.
	if ( $display_price ) {
		$price_node                       = $xpath->query( "//div[contains(@class, '" . $class . '__price' . "')]" );
		$price_node->item( 0 )->nodeValue = $product->get_price_html();
	}

	if ( is_array( $html_attributes ) && ! empty( $html_attributes ) ) {
		foreach ( $html_attributes as $key => $value ) {
			$button_node->item( 0 )->setAttribute( $key, $value );
		}
	}

	// Get HTML to show product stock.
	if ( $display_stock ) {
		$stock_node                       = $xpath->query( "//div[contains(@class, '" . $class . '__stock' . "')]" );
		$stock_node->item( 0 )->nodeValue = wc_get_stock_html( $product );
	}

	// Dumps the internal document into a string using HTML formatting.
	$striped_content = html_entity_decode( trim( $dom->saveHTML() ), ENT_COMPAT, 'UTF-8' );

	return $striped_content;
}

/**
 * Generates inline add-to-cart link HTML attributes.
 *
 * @param   object $product               Product object.
 * @param   array  $custom_classes        Optional. A list of CSS class names associated with the anchor tag.
 * @return  array
 */
function get_attributes( $product, $custom_classes = array() ) {
	$attributes = array();

	if ( is_object( $product ) ) {
		$attributes = apply_filters(
			'sixa_add_to_cart_block_button_attrs',
			array(
				'href'             => $product->add_to_cart_url(),
				'class'            => implode(
					' ',
					array_filter(
						array_merge(
							$custom_classes,
							array(
								'product_type_' . $product->get_type(),
								$product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '',
								$product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock() ? 'ajax_add_to_cart' : '',
							)
						)
					)
				),
				'data-product_id'  => $product->get_id(),
				'data-product_sku' => $product->get_sku(),
				'aria-label'       => $product->add_to_cart_description(),
				'rel'              => 'nofollow',
			)
		);
	}

	return $attributes;
}

/**
 * Query WooCommerce activation.
 *
 * @return  bool
 */
function is_woocommerce() {
	// This statement prevents from producing fatal errors,
	// in case the WooCommerce plugin is not activated on the site.
	$woocommerce_plugin = apply_filters( 'sixa_add_to_cart_block_woocommerce_path', 'woocommerce/woocommerce.php' );
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	$subsite_active_plugins = apply_filters( 'active_plugins', get_option( 'active_plugins' ) );
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	$network_active_plugins = apply_filters( 'active_plugins', get_site_option( 'active_sitewide_plugins' ) );

	// Bail early in case the plugin is not activated on the website.
	// phpcs:ignore WordPress.PHP.StrictInArray.MissingTrueStrict
	if ( ( empty( $subsite_active_plugins ) || ! in_array( $woocommerce_plugin, $subsite_active_plugins ) ) && ( empty( $network_active_plugins ) || ! array_key_exists( $woocommerce_plugin, $network_active_plugins ) ) ) {
		return false;
	}

	return true;
}
