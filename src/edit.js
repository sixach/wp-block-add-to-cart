/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, set, map, isArray, parseInt, toString, filter, find, merge } from 'lodash';

/**
 * Helper React components specific for Sixa projects.
 */
import { Loading } from '@sixach/wp-block-components';

/**
 * Utility helper methods specific for Sixa projects.
 */
import { blockClassName } from '@sixach/wp-block-utils';

/**
 * Utility for conditionally joining CSS class names together.
 */
import classnames from 'classnames';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Utility to make WordPress REST API requests. It's a wrapper around `window.fetch`.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/api-fetch/README.md
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Escape HTML utils.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/escape-html/README.md
 */
import { escapeHTML } from '@wordpress/escape-html';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/element/README.md
 */
import { useState, useEffect, useRef, RawHTML } from '@wordpress/element';

/**
 * Data module to manage application state for both plugins and WordPress itself.
 * The data module is built upon and shares many of the same core principles of Redux.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/data/README.md
 */
import { withSelect, useDispatch } from '@wordpress/data';

/**
 * The compose package is a collection of handy Hooks and Higher Order Components (HOCs).
 * The compose function is an alias to `flowRight` from Lodash.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/README.md
 */
import { compose, withState, withInstanceId } from '@wordpress/compose';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/hooks/README.md
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, withColors, __experimentalUseGradient } from '@wordpress/block-editor';

/**
 * This component allows users to select a product from a single-option menu.
 */
import ProductSelect from './product-select';

/**
 * This component is intended to be displayed in place of the actual button.
 */
import AddToCart from './add-to-cart';

/**
 * Block Toolbar controls settings.
 */
import Controls from './controls';

/**
 * Inspector Controls sidebar settings.
 */
import Inspector from './inspector';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.css';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	{Object}    props           Block meta-data properties.
 * @return 	{WPElement}                 Element to render.
 */
function Edit( props ) {
	const styles = {};
	const isStillMounted = useRef();
	const [ isEditing, setIsEditing ] = useState( true );
	const [ wpQuery, setWpQuery ] = useState( '' );
	const [ productOptions, setProductOptions ] = useState( [] );
	const { isSelected, attributes, setAttributes, textColor, backgroundColor, useGradient, priceHtml, stockHtml, setState } = props;
	const { postId, text, textAlign, placeholder, displayPrice, displayStock } = attributes;
	const { gradientClass, gradientValue } = useGradient;
	const textColorClass = get( textColor, 'class' );
	const backgroundColorClass = get( backgroundColor, 'class' );
	const apiFetchQuery = applyFilters( 'sixa.addToCartApiFetchQueryArgs', { per_page: -1 } );
	const purchasable = ( query ) => filter( query, [ 'purchasable', true ] );
	const selectOptions = ( query ) => map( query, ( { id, name } ) => ( { label: `(#${ id }) — ${ name }`, value: toString( id ) } ) );
	const handleOnChangeProduct = ( value ) => setAttributes( { postId: parseInt( value ) } );
	const { createErrorNotice } = useDispatch( 'core/notices' );
	const toggleEditing = () => setIsEditing( ! isEditing );
	const blockProps = useBlockProps( {
		className: classnames( 'product', 'add_to_cart_inline', {
			[ `has-text-align-${ textAlign }` ]: postId && textAlign,
		} ),
	} );
	const className = blockClassName( get( blockProps, 'className' ) );

	useEffect( () => {
		set( isStillMounted, 'current', true );

		apiFetch( {
			path: addQueryArgs( '/wc/v3/products', apiFetchQuery ),
		} )
			.then( ( data ) => {
				if ( isStillMounted.current ) {
					setWpQuery( purchasable( data ) );
				}
			} )
			.catch( () => {
				if ( isStillMounted.current ) {
					setWpQuery( [] );
					createErrorNotice( __( 'Could not load products.', 'sixa' ), { isDismissible: true, type: 'snackbar' } );
				}
			} )
			.finally( () => {
				if ( postId ) {
					toggleEditing();
				}
			} );

		return () => set( isStillMounted, 'current', false );
	}, [] );

	useEffect( () => {
		setProductOptions( selectOptions( wpQuery ) );
	}, [ wpQuery ] );

	useEffect( () => {
		const updateState = ( destination, source ) => merge( {}, destination, source );
		const findProduct = find( wpQuery, [ 'id', parseInt( postId ) ] );

		setState( ( state ) => updateState( state, { priceHtml: get( findProduct, 'price_html' ) } ) );
		setState( ( state ) => updateState( state, { stockHtml: get( findProduct, 'stock_html' ) } ) );
		setState( ( state ) => updateState( state, { stockQty: get( findProduct, 'stock_quantity' ) } ) );
	}, [ postId, wpQuery ] );

	if ( ! textColorClass ) {
		set( styles, 'color', get( textColor, 'color' ) );
	}

	if ( ! backgroundColorClass ) {
		set( styles, 'backgroundColor', get( backgroundColor, 'color' ) );
	}

	if ( gradientValue ) {
		set( styles, 'background', gradientValue );
	}

	return (
		<>
			<div { ...blockProps }>
				{ ! isArray( wpQuery ) || ! get( isStillMounted, 'current' ) ? (
					<Loading label={ __( 'Fetching…', 'sixa' ) } />
				) : (
					<>
						{ isEditing ? (
							<ProductSelect
								label={ __( 'Product', 'sixa' ) }
								instructions={ __( 'Select a product from the dropdown menu below:', 'sixa' ) }
								productValue={ toString( postId ) }
								productOptions={ productOptions }
								onChange={ handleOnChangeProduct }
								toggleEditing={ toggleEditing }
							/>
						) : (
							<>
								{ displayPrice && <RawHTML className={ `${ className }__price` }>{ priceHtml }</RawHTML> }
								{ applyFilters(
									'sixa.addToCartComponent',
									<AddToCart
										value={ text }
										placeholder={ placeholder || __( 'Add to cart…', 'sixa' ) }
										onChange={ ( value ) => setAttributes( { text: escapeHTML( value ) } ) }
										aria-label={ __( 'Button text', 'sixa' ) }
										className={ classnames( 'wp-block-button__link', `${ className }__button`, {
											'has-text-color': textColorClass,
											'has-background': backgroundColorClass,
											'has-background-gradient': gradientValue,
											[ textColorClass ]: textColorClass,
											[ backgroundColorClass ]: backgroundColorClass,
											[ gradientClass ]: gradientClass,
										} ) }
										style={ { ...styles } }
									/>,
									className,
									attributes,
									setAttributes
								) }
								{ displayStock && <RawHTML className={ `${ className }__stock` }>{ stockHtml }</RawHTML> }
							</>
						) }
					</>
				) }
				{ isSelected && ! isEditing && postId && (
					<>
						<Controls { ...props } toggleEditing={ toggleEditing } />
						<Inspector { ...props } />
					</>
				) }
			</div>
		</>
	);
}

export default compose( [
	withInstanceId,
	withColors( { textColor: 'color' }, 'backgroundColor' ),
	withState( {
		priceHtml: '',
		stockHtml: '',
		stockQty: 1,
	} ),
	withSelect( () => {
		return {
			useGradient: __experimentalUseGradient(),
		};
	} ),
] )( Edit );
