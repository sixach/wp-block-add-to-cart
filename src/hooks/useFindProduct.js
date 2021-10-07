/**
 * Utility for libraries from the `Lodash`.
 */
import find from 'lodash/find';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Finds the selected product object based on the given post id
 * and maintains the state of change when it happens.
 *
 * @param     {Array}     productsQuery    A list of products retrieved from the API.
 * @param     {number}    postId           Selected post id.
 * @return    {Object}                     Product id.
 */
function useFindProduct( productsQuery, postId ) {
	const [ product, setProduct ] = useState();

	useEffect( () => {
		setProduct( find( productsQuery, [ 'id', parseInt( postId ) ] ) );
	}, [ productsQuery, postId ] );

	return product;
}

export default useFindProduct;
