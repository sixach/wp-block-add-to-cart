<?php
/**
 * Plugin Name:         Sixa - Add to Cart
 * Description:         Add to Cart block for WordPress editor.
 * Version:             0.1.0
 * Author:              sixa AG
 * License:             GPL-3.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:         sixa
 * Requires at least:   WordPress 5.6
 * Requires PHP:        7.2
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

	$dom = new \DOMDocument();
	// Loads an XML document from the given form content (string).
	$dom->loadXML( $content );
	$xpath          = new \DomXPath( $dom );
	$the_node       = $xpath->query( '//a' );
	$custom_classes = array( 'class' => $the_node->item( 0 )->getAttribute( 'class' ) );
	$attributes     = get_attributes( $product_id, $custom_classes );

	if ( is_array( $attributes ) && ! empty( $attributes ) ) {
		foreach ( $attributes as $key => $value ) {
			$the_node->item( 0 )->setAttribute( $key, $value );
		}
	}

	// Dumps the internal document into a string using HTML formatting.
	$striped_content = trim( $dom->saveHTML() );

	return $striped_content;
}

/**
 * Generates inline add-to-cart link HTML attributes.
 *
 * @param   int   $product_id            Optional. Product id.
 * @param   array $custom_classes        Optional. A list of CSS class names associated with the anchor tag.
 * @return  array
 */
function get_attributes( $product_id = '', $custom_classes = array() ) {
	$attributes = array();
	$product    = wc_get_product( $product_id );

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
