<?php
/**
 * Add to Cart Block.
 *
 * @wordpress-plugin
 * Plugin Name:          Sixa - Add to Cart Block
 * Description:          Display an add-to-cart button for a given product.
 * Version:              1.0.0
 * Requires at least:    5.7
 * Requires PHP:         7.3
 * Author:               sixa AG
 * Author URI:           https://sixa.ch
 * License:              GPL v3 or later
 * License URI:          https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:          sixa-block-add-to-cart
 *
 * @package              Sixa_Blocks
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