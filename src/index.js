/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see  	https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './Edit';
import save from './save';
import Icon from './Icon';

/**
 * Block registration API.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( 'sixa/add-to-cart', {
	/**
	 * @see    https://make.wordpress.org/core/2020/11/18/block-api-version-2/
	 */
	apiVersion: 2,

	/**
	 * @see    ./edit.js
	 */
	edit: Edit,

	/**
	 * @see    ./Icon.js
	 */
	icon: Icon,

	/**
	 * @see    ./save.js
	 */
	save,
} );
