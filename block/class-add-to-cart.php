<?php
/**
 * Block class file.
 *
 * @link          https://sixa.ch
 * @author        sixa AG <info@sixa.ch>
 *
 * @since         1.0.0
 * @package       Sixa_Blocks
 * @subpackage    Sixa_Blocks\Add_To_Cart
 */

namespace Sixa_Blocks;

use Sixa_Snippets\Includes\Utils as Utils;

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

if ( ! class_exists( Add_To_Cart::class ) ) :

	/**
	 * Block Class Add to Cart
	 */
	final class Add_To_Cart extends WooCommerce_Block {

		/**
		 * Base directory of classes and templates for this extension.
		 * Used to import templates.
		 *
		 * @since    1.0.0
		 * @var      string
		 */
		public const BASE_DIR = __DIR__;

		/**
		 * Block specific CSS class name.
		 *
		 * @since    1.0.0
		 * @var      string
		 */
		public const CLASSNAME = 'wp-block-sixa-add-to-cart';

		/**
		 * The first URL segment after core prefix.
		 *
		 * @since    1.0.0
		 * @var      string
		 */
		public const NAMESPACE_URI = 'sixa-add-to-cart-block/v1';

		/**
		 * Initialize this block.
		 * Adds actions and calls the parent `init` function.
		 *
		 * @since     1.0.0
		 * @return    void
		 */
		public static function init(): void {
			self::add_actions();
			parent::init();
		}

		/**
		 * Registers the block using the metadata loaded from the `block.json` file.
		 * Behind the scenes, it registers also all assets so they can be enqueued
		 * through the block editor in the corresponding context.
		 *
		 * @see       https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
		 * @since     1.0.0
		 * @return    void
		 */
		public static function register(): void {
			register_block_type_from_metadata(
				plugin_dir_path( self::BASE_DIR ),
				array(
					'render_callback' => array( self::class, 'render' ),
				)
			);
		}

		/**
		 * Renders the `sixa/add-to-cart` block on server.
		 *
		 * @since     1.0.0
		 * @param     array  $attributes    The block attributes.
		 * @param     string $content       The block content.
		 * @return    string
		 */
		public static function render( array $attributes = array(), string $content ): ?string {
			libxml_use_internal_errors( true );
			$dom = new \DOMDocument();
			$dom->loadHTML( mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED );
			$xpath = new \DomXPath( $dom );
			$node  = $xpath->query( "//a[contains(@class, 'button')]" );

			if ( $node ) {
				$button = $node->item( 0 );

				// Check if the button node exists.
				if ( is_object( $button ) ) {
					$product_id = $attributes['postId'] ?? '';
					$product    = wc_get_product( $product_id );

					if ( ! $product ) {
						$content = self::get_not_found_html();
					} else {
						$custom_classes  = array( 'class' => $button->getAttribute( 'class' ) );
						$html_attributes = self::get_html_attributes( $product, $custom_classes );
						$after_content   = apply_filters( 'sixa_add_to_cart_block_after_content', __return_empty_string(), $product, $attributes );

						if ( ! empty( $after_content ) ) {
							$after_content_fragment = $dom->createDocumentFragment();
							$after_content_fragment->appendXML( $after_content );
							$button->parentNode->insertBefore( $after_content_fragment ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
						}

						if ( is_array( $html_attributes ) && ! empty( $html_attributes ) ) {
							foreach ( $html_attributes as $key => $value ) {
								$button->setAttribute( $key, $value );
							}
						}

						libxml_clear_errors();
						$content = $dom->saveHTML();
					}
				}
			}

			return apply_filters( 'sixa_add_to_cart_block_content', $content, $attributes );
		}

		/**
		 * Add all relevant actions for this block.
		 *
		 * @since     1.0.0
		 * @return    void
		 */
		public static function add_actions(): void {
			add_action( 'rest_api_init', array( self::class, 'rest_api_routes' ) );
			add_filter( 'woocommerce_rest_prepare_product_object', array( self::class, 'prepare_product_object' ), 10, 2 );
			add_filter( 'sixa_add_to_cart_block_after_content', array( self::class, 'template_functions' ), 10, 3 );
			add_filter( 'sixa_add_to_cart_block_content', array( self::class, 'hide_if_out_of_stock' ), 11, 2 );
		}

		/**
		 * Registers custom REST API routes.
		 *
		 * @since     1.0.0
		 * @return    void
		 */
		public static function rest_api_routes(): void {
			register_rest_route(
				self::NAMESPACE_URI,
				'nodes/',
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( self::class, 'get_html_nodes_response' ),
					'permission_callback' => array( self::class, 'permission_callback' ),
				)
			);
		}

		/**
		 * Add extra parameters to the posts (endpoint) response.
		 *
		 * @since     1.0.0
		 * @param     \WP_REST_Response $response    The response object.
		 * @param     object            $post        Post object or WC object.
		 * @return    \WP_REST_Response
		 */
		public static function prepare_product_object( \WP_REST_Response $response, object $post ): \WP_REST_Response {
			$product_id    = is_callable( array( $post, 'get_id' ) ) ? $post->get_id() : ( ! empty( $post->ID ) ? $post->ID : null );
			$product       = wc_get_product( $product_id );
			$html_response = array();
			$html_nodes    = self::get_html_nodes();

			if ( is_array( $html_nodes ) && ! empty( $html_nodes ) ) {
				foreach ( array_keys( $html_nodes ) as $method ) {
					$html_response[ $method ] = call_user_func( $method, $product, false );
				}

				$response->data['sixa_add_to_cart_block'] = apply_filters(
					'sixa_add_to_cart_block_rest_prepare_post_object_args',
					array(
						'nodes' => $html_response,
					),
					$product,
					$product_id
				);
			}

			return apply_filters( 'sixa_add_to_cart_block_rest_prepare_product_object', $response );
		}

		/**
		 * Hide `Add to Cart` button if product is no longer in-stock.
		 *
		 * @since     1.0.0
		 * @param     string $content       Original block content.
		 * @param     array  $attributes    The block attributes.
		 * @return    string
		 */
		public static function hide_if_out_of_stock( string $content, array $attributes = array() ): ?string {
			$product_id = $attributes['postId'] ?? '';
			$product    = wc_get_product( $product_id );

			if ( self::is_product( (object) $product ) ) {
				$hide_if_out_of_stock = $attributes['hideIfOutOfStock'] ?? false;
				$is_in_stock          = $product->is_in_stock();

				if ( ! $is_in_stock && $hide_if_out_of_stock ) {
					return null;
				}
			}

			return $content;
		}

		/**
		 * Functions that are plugged into the template action hooks.
		 *
		 * @since     1.0.0
		 * @param     string $content       Original block content.
		 * @param     object $product       Post object or WC product object.
		 * @param     array  $attributes    The block attributes.
		 * @return    string
		 */
		public static function template_functions( string $content, object $product, array $attributes = array() ): ?string {
			$return     = $content;
			$html_nodes = self::get_html_nodes();

			if ( is_array( $html_nodes ) && ! empty( $html_nodes ) ) {
				$return      .= sprintf( '<div class="%s__meta">', sanitize_html_class( apply_filters( 'sixa_add_to_cart_block_class_name', self::CLASSNAME ) ) );
				$hidden_nodes = $attributes['hiddenNodes'] ?? array();
				foreach ( array_diff( array_keys( $html_nodes ), $hidden_nodes ) as $method ) {
					$return .= call_user_func( $method, $product, false );
				}
				$return .= '</div>';
			}

			return Utils::normalize_xml_character_entities( $return );
		}

		/**
		 * Retrieves the list of HTML nodes for the block.
		 *
		 * @since     1.0.0
		 * @return    \WP_REST_Response
		 */
		public static function get_html_nodes_response(): \WP_REST_Response {
			$response = new \WP_REST_Response( self::get_html_nodes() );
			$response->set_status( 200 );

			return $response;
		}

		/**
		 * A list of REST-API nodes to be included as part of the response.
		 *
		 * @since     1.0.0
		 * @return    array
		 */
		public static function get_html_nodes(): array {
			return apply_filters(
				'sixa_add_to_cart_block_html_nodes',
				array(
					__CLASS__ . '::get_stock_html' => __( 'Stock status', 'sixa-block-add-to-cart' ),
					__CLASS__ . '::get_price_html' => __( 'Price', 'sixa-block-add-to-cart' ),
				)
			);
		}

		/**
		 * Returns the product stock status.
		 *
		 * @since     1.0.0
		 * @param     object $product    The product object.
		 * @param     bool   $echo       Optional. Echo the string or return it.
		 * @return    string
		 */
		public static function get_stock_html( object $product, bool $echo = true ): ?string {
			$return       = '';
			$availability = $product->get_availability();

			if ( ! empty( $availability['availability'] ) ) {
				$return  = sprintf( '<div class="%s__stock">', sanitize_html_class( apply_filters( 'sixa_add_to_cart_block_class_name', self::CLASSNAME ) ) );
				$return .= wc_get_stock_html( $product );
				$return .= '</div>';
			}

			if ( $echo ) {
				echo $return; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}

			return $return;
		}

		/**
		 * Returns the product price.
		 *
		 * @since     1.0.0
		 * @param     object $product    The product object.
		 * @param     bool   $echo       Optional. Echo the string or return it.
		 * @return    string
		 */
		public static function get_price_html( object $product, bool $echo = true ): ?string {
			$return  = sprintf( '<div class="%s__price">', sanitize_html_class( apply_filters( 'sixa_add_to_cart_block_class_name', self::CLASSNAME ) ) );
			$return .= $product->get_price_html();
			$return .= '</div>';

			if ( $echo ) {
				echo $return; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}

			return $return;
		}

		/**
		 * Returns the not found message.
		 *
		 * @since     1.0.0
		 * @return    string
		 */
		public static function get_not_found_html(): string {
			/* translators: 1: Open div and paragraph tags, 2: Close div and paragraph tags. */
			$return = sprintf( esc_html__( '%1$sThe selected product could not be found.%2$s', 'sixa-block-add-to-cart' ), sprintf( '<div class="%1$s"><p class="%1$s__not-found">', sanitize_html_class( apply_filters( 'sixa_add_to_cart_block_class_name', self::CLASSNAME ) ) ), '</p></div>' );
			return $return;
		}

		/**
		 * Generates inline add-to-cart link HTML attributes.
		 *
		 * @param     object $product           Product object.
		 * @param     array  $custom_classes    Optional. A list of CSS class names associated with the anchor tag.
		 * @return    array
		 */
		public static function get_html_attributes( object $product, array $custom_classes = array() ): array {
			$attributes = array();

			if ( self::is_product( (object) $product ) ) {
				$attributes = apply_filters(
					'sixa_add_to_cart_block_button_attrs',
					array(
						'aria-label'       => $product->add_to_cart_description(),
						'class'            => implode(
							' ',
							array_filter(
								array_merge(
									$custom_classes,
									array(
										'product_type_' . $product->get_type(),
										sprintf( '%s__add-to-cart', sanitize_html_class( apply_filters( 'sixa_add_to_cart_block_class_name', self::CLASSNAME ) ) ),
										$product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '',
										$product->supports( 'ajax_add_to_cart' ) && $product->is_purchasable() && $product->is_in_stock() ? 'ajax_add_to_cart' : '',
									)
								)
							)
						),
						'data-product_sku' => $product->get_sku(),
						'href'             => $product->add_to_cart_url(),
					)
				);
			}

			return $attributes;
		}

		/**
		 * Determines whether the examined post object is a product type.
		 *
		 * @since     1.0.0
		 * @param     object $post    Post object.
		 * @return    bool
		 */
		public static function is_product( object $post ): bool {
			return property_exists( $post, 'post_type' ) && 'product' === $post->post_type;
		}

		/**
		 * Returns whether the current user has the specified capability.
		 *
		 * @since     1.0.0
		 * @return    bool
		 */
		public static function permission_callback(): bool {
			return current_user_can( 'edit_posts' );
		}

	}

endif;
