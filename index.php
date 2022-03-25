<?php
/**
 * Add to Cart Block.
 *
 * @wordpress-plugin
 * Plugin Name:             Sixa - Add to Cart Block
 * Description:             Add an add-to-cart button for any WooCommerce product anywhere on your page. Set the quantity, toggle additional information like the stock status and the price, and automatically hide the button if the product goes out of stock.
 * Version:                 1.0.1
 * Requires at least:       5.7
 * Requires PHP:            7.4
 * Author:                  sixa AG
 * Author URI:              https://sixa.com
 * License:                 GPL v3 or later
 * License URI:             https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:             sixa-block-add-to-cart
 * WC requires at least:    4.5
 * WC tested up to:         6.2
 *
 * @package                 Sixa_Blocks
 */

defined( 'ABSPATH' ) || exit; // Exit if accessed directly.

/**
 * Include the namespace of this block.
 */
use Sixa_Blocks\Add_To_Cart;

/**
 * Composer autoload is needed in this package even if
 * it doesn't use any libraries to autoload the classes
 * from this package.
 *
 * @see    https://getcomposer.org/doc/01-basic-usage.md#autoloading
 */
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

/**
 * Initialize your block.
 *
 * Other than this function call, this file should not include any logic
 * and should merely be used as an entry point to use this package as
 * a WordPress plugin.
 */
Add_To_Cart::init();
