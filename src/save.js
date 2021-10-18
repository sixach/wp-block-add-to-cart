/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import set from 'lodash/set';

/**
 * Helper React components specific for Sixa projects.
 */
import { EditableText } from '@sixa/wp-block-components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, getColorClassName, __experimentalGetGradientClass } from '@wordpress/block-editor';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Helper constants.
 */
import Constants from './constants';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 * @param 	  {Object} 		   props               Block meta-data properties.
 * @param 	  {Object} 		   props.attributes    Block attributes.
 * @return    {JSX.Element} 					   Container element to render.
 */
function save( { attributes } ) {
	const styles = {};
	const {
		backgroundColor,
		customBackgroundColor,
		customGradient: customBackgroundGradient,
		customTextColor,
		gradient: backgroundGradient,
		postId,
		quantity,
		text,
		textAlign,
		textColor,
	} = attributes;
	const blockProps = useBlockProps.save( { className: classnames( { [ `has-text-align-${ textAlign }` ]: !! postId && textAlign } ) } );
	const backgroundColorClass = getColorClassName( 'background-color', backgroundColor );
	const backgroundGradientClass = __experimentalGetGradientClass( backgroundGradient );
	const textColorClass = getColorClassName( 'color', textColor );
	const classNames = classnames( Constants.BUTTON_CLASSNAME, {
		'has-background': backgroundColorClass || customBackgroundColor,
		'has-background-gradient': backgroundGradientClass || customBackgroundGradient,
		'has-text-color': textColorClass || customTextColor,
		[ backgroundColorClass ]: backgroundColorClass,
		[ backgroundGradientClass ]: backgroundGradientClass,
		[ textColorClass ]: textColorClass,
	} );

	if ( ! backgroundColorClass ) {
		set( styles, 'backgroundColor', customBackgroundColor );
	}

	if ( customBackgroundGradient ) {
		set( styles, 'background', customBackgroundGradient );
	}

	if ( ! textColorClass ) {
		set( styles, 'color', customTextColor );
	}

	return (
		<div { ...blockProps }>
			<EditableText
				className={ classNames }
				data-product_id={ postId }
				data-quantity={ quantity }
				isSave
				rel="nofollow"
				shouldRender={ !! postId }
				tagName="a"
				value={ text }
				style={ styles }
			/>
		</div>
	);
}

export default save;
