/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, set } from 'lodash';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName } from '@sixa/wp-block-utils';

/**
 * Helper React components specific for Sixa projects.
 */
import { EditableText, Loading, PostSelectForm } from '@sixa/wp-block-components';

/**
 * Helper React hooks specific for Sixa projects.
 */
import { useFindPostById, useGetNodeList, useGetProducts, usePreparePosts, useToggle } from '@sixa/wp-react-hooks';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { useBlockProps, withColors, __experimentalUseGradient } from '@wordpress/block-editor';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { Notice } from '@wordpress/components';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import {useEffect, useMemo} from '@wordpress/element';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-hooks/
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internationalization utilities for client-side localization.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Block Toolbar controls settings.
 */
import Controls from './components/Controls';

/**
 * Inspector Controls sidebar settings.
 */
import Inspector from './components/Inspector';

/**
 * The nodes template component.
 */
import Nodes from './components/Nodes';

/**
 * Helper constants.
 */
import Constants from './constants';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see 	  https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	  {Object}         props    		           Block meta-data properties.
 * @param 	  {Object} 	       props.attributes            Block attributes.
 * @param 	  {string} 	       props.clientId              The block’s client id.
 * @param 	  {Object} 	       props.backgroundColor       An object containing the background background-color class name and a hex value of it.
 * @param 	  {Function} 	   props.setAttributes         Update block attributes.
 * @param 	  {Function} 	   props.setBackgroundColor    Function to update the background background-color.
 * @param 	  {Function} 	   props.setTextColor    	   Function to update the text color.
 * @param 	  {Object} 	       props.textColor    	       An object containing the text-color class name and a hex value of it.
 * @return    {JSX.Element} 			  		           Element to render.
 */
function Edit( { attributes, clientId, backgroundColor, setAttributes, setBackgroundColor, setTextColor, textColor } ) {
	const styles = {};
	const { postId, text, textAlign } = attributes;
	const [ isEditing, toggleIsEditing ] = useToggle( ! Boolean( postId ) );
	const { isLoading, productsOptions, productsQuery } = useGetProducts( {}, clientId );
	const { havePosts } = usePreparePosts( [], 1, productsQuery );
	const nodeList = useGetNodeList( 'sixa-add-to-cart-block/v1/nodes' );
	const product = useFindPostById( postId, productsQuery );
	const blockProps = useBlockProps( { className: classnames( { [ `has-text-align-${ textAlign }` ]: ! isEditing && textAlign } ) } );
	const className = blockClassName( blockProps?.className );
	const { maxStockQuantity, nodes } = useMemo(
		() => ( { maxStockQuantity: get( product, 'stock_quantity' ), nodes: get( product, 'sixa_add_to_cart_block.nodes' ) } ),
		[ product ]
	);

	useEffect( () => {
		if ( ! product && ! isEditing ) {
			toggleIsEditing();
			if ( Boolean( postId ) ) {
				setAttributes({ postId: undefined });
			}
		}
	}, [ product ] );

	const { gradientClass: backgroundGradientClass, gradientValue: backgroundGradientValue, setGradient: setBackgroundGradient } = __experimentalUseGradient();
	const { backgroundColorClass, backgroundColorValue, textColorClass, textColorValue } = useMemo(
		() => ( {
			backgroundColorClass: backgroundColor?.class,
			backgroundColorValue: backgroundColor?.color,
			textColorClass: textColor?.class,
			textColorValue: textColor?.color,
		} ),
		[ backgroundColor, textColor ]
	);
	const classNames = classnames( Constants.BUTTON_CLASSNAME, {
		'has-background': backgroundColorClass || backgroundColorValue,
		'has-background-gradient': backgroundGradientClass || backgroundGradientValue,
		'has-text-color': textColorClass || textColorValue,
		[ backgroundColorClass ]: backgroundColorClass,
		[ backgroundGradientClass ]: backgroundGradientClass,
		[ textColorClass ]: textColorClass,
	} );

	if ( ! backgroundColorClass ) {
		set( styles, 'backgroundColor', backgroundColorValue );
	}

	if ( backgroundGradientValue ) {
		set( styles, 'background', backgroundGradientValue );
	}

	if ( ! textColorClass ) {
		set( styles, 'color', textColorValue );
	}

	return (
		<div { ...blockProps }>
			{
				/* eslint-disable-next-line no-nested-ternary */
				Boolean( isLoading ) ? (
					<Loading />
				) : havePosts ? (
					<>
						<PostSelectForm
							isEditing={ isEditing }
							instructions={ __( 'Select a product from the dropdown menu below:', 'sixa-block-add-to-cart' ) }
							label={ __( 'Product', 'sixa-block-add-to-cart' ) }
							onCancel={ toggleIsEditing }
							onChange={ ( value ) => setAttributes( { postId: value } ) }
							options={ productsOptions }
							shouldRender
							value={ postId }
						/>
						{ applyFilters(
							'sixa.addToCartComponent',
							<EditableText
								className={ classNames }
								isSave={ false }
								onChange={ ( value ) => setAttributes( { text: value } ) }
								placeholder={ __( 'Add to cart…', 'sixa-block-add-to-cart' ) }
								shouldRender={ ! isEditing }
								tagName="div"
								value={ text }
								style={ styles }
							/>,
							className,
							classNames,
							styles,
							attributes,
							setAttributes
						) }
						<Nodes attributes={ attributes } className={ `${ className }__meta` } nodes={ nodes } shouldRender={ ! isEditing } />
						<Controls attributes={ attributes } setAttributes={ setAttributes } shouldRender={ ! isEditing } />
						<Inspector
							attributes={ attributes }
							backgroundColor={ { backgroundColorValue, setBackgroundColor } }
							backgroundGradient={ { backgroundGradientValue, setBackgroundGradient } }
							maxStockQuantity={ maxStockQuantity }
							nodeList={ nodeList }
							setAttributes={ setAttributes }
							shouldRender={ ! isEditing }
							textColor={ { textColorValue, setTextColor } }
						/>
					</>
				) : (
					<Notice css={ { margin: 0 } } isDismissible={ false } status="warning">
						{ __( 'No products found to display.', 'sixa-block-add-to-cart' ) }
					</Notice>
				)
			}
		</div>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
