/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, set } from 'lodash';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName } from '@sixach/wp-block-utils';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, RichText, getColorClassName, __experimentalGetGradientClass } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @param   {Object}    props 					Block meta-data properties.
 * @param   {Object}  	props.attributes 	    Block attributes.
 * @return 	{WPElement} 						Element to render.
 */
export default function save( { attributes } ) {
	const styles = {};
	const {
		postId,
		quantity,
		text,
		displayPrice,
		displayStock,
		textAlign,
		textColor,
		customTextColor,
		backgroundColor,
		customBackgroundColor,
		gradient,
		customGradient,
	} = attributes;
	const textColorClass = getColorClassName( 'color', textColor );
	const backgroundColorClass = getColorClassName( 'background-color', backgroundColor );
	const gradientClass = __experimentalGetGradientClass( gradient );
	const blockProps = useBlockProps.save( {
		className: classnames( 'product', 'add_to_cart_inline', {
			[ `has-text-align-${ textAlign }` ]: postId && textAlign,
		} ),
	} );
	const className = blockClassName( get( blockProps, 'className' ) );

	if ( ! textColorClass ) {
		set( styles, 'color', customTextColor );
	}

	if ( ! backgroundColorClass ) {
		set( styles, 'backgroundColor', customBackgroundColor );
	}

	if ( customGradient ) {
		set( styles, 'background', customGradient );
	}

	return (
		<div { ...blockProps }>
			{ displayPrice && <div className={ `${ className }__price` }></div> }
			{ postId && (
				<RichText.Content
					tagName="a"
					value={ text }
					data-quantity={ quantity }
					className={ classnames( 'button', 'wp-block-button__link', `${ className }__button`, {
						'has-text-color': textColorClass,
						'has-background': backgroundColorClass,
						'has-background-gradient': gradient || customGradient,
						[ textColorClass ]: textColorClass,
						[ backgroundColorClass ]: backgroundColorClass,
						[ gradientClass ]: gradientClass,
					} ) }
					style={ { ...styles } }
				/>
			) }
			{ displayStock && <div className={ `${ className }__stock` }></div> }
		</div>
	);
}
