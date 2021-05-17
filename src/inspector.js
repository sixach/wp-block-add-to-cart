/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Utility for libraries from the `Lodash`.
 */
import { get, eq } from 'lodash';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * WordPress specific abstraction layer atop React.
 *
 * @see https://github.com/WordPress/gutenberg/tree/HEAD/packages/element/README.md
 */
import { useEffect } from '@wordpress/element';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { InspectorControls, ContrastChecker, __experimentalPanelColorGradientSettings as PanelColorGradientSettings } from '@wordpress/block-editor';

/**
 * Inspector Controls appear in the post settings sidebar when a block is being edited.
 *
 * @see     https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/inspector-controls/README.md
 * @param   {Object}    props 					        Block meta-data properties.
 * @param   {Object}    props.attributes 		    	Block attributes.
 * @param   {Function}  props.setAttributes 	    	Update block attributes.
 * @param   {Object}    props.textColor 	            Color hex code and CSS class name.
 * @param   {Function}  props.setTextColor 	            Update color value.
 * @param   {Object}    props.backgroundColor 	        Background-color hex code and CSS class name.
 * @param   {Function}  props.setBackgroundColor 	    Update background-color value.
 * @param   {Function}  props.useGradient 	            Update, get background gradient color.
 * @param   {number}  	props.stockQuantity 	        Available stock quantity.
 * @param   {boolean}  	props.isPrice 	        		Whether the price is available to be displayed.
 * @param   {boolean}  	props.isStock 	        		Whether the stock status is available to be displayed.
 * @return 	{WPElement} 						        Inspector element to render.
 */
export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
	backgroundColor,
	setBackgroundColor,
	useGradient,
	stockQuantity,
	isPrice,
	isStock,
} ) {
	const { quantity, displayPrice, displayStock } = attributes;
	const { setGradient, gradientValue } = useGradient;

	useEffect( () => {
		if ( ! isPrice ) {
			setAttributes( { displayPrice: isPrice } );
		}
		if ( ! isStock ) {
			setAttributes( { displayStock: isStock } );
		}
	}, [ isPrice, isStock ] );

	return (
		<InspectorControls>
			<PanelBody initialOpen title={ __( 'Button Settings', 'sixa' ) }>
				<RangeControl
					required
					readonly
					label={ __( 'Quantity', 'sixa' ) }
					min={ 1 }
					max={ stockQuantity }
					value={ quantity }
					disabled={ eq( 1, stockQuantity ) ?? true }
					onChange={ ( value ) => setAttributes( { quantity: value } ) }
				/>
				<ToggleControl
					label={ __( 'Display price?', 'sixa' ) }
					disabled={ ! isPrice }
					checked={ displayPrice }
					onChange={ () => setAttributes( { displayPrice: ! displayPrice } ) }
				/>
				<ToggleControl
					label={ __( 'Display stock?', 'sixa' ) }
					disabled={ ! isStock }
					checked={ displayStock }
					onChange={ () => setAttributes( { displayStock: ! displayStock } ) }
				/>
			</PanelBody>
			<PanelColorGradientSettings
				initialOpen={ false }
				title={ __( 'Color Settings', 'sixa' ) }
				settings={ [
					{
						label: __( 'Text', 'sixa' ),
						colorValue: get( textColor, 'color' ),
						onColorChange: setTextColor,
					},
					{
						label: __( 'Background', 'sixa' ),
						colorValue: get( backgroundColor, 'color' ),
						gradientValue,
						onColorChange: setBackgroundColor,
						onGradientChange: setGradient,
					},
				] }
			>
				<ContrastChecker
					{ ...{
						textColor: get( textColor, 'color' ),
						backgroundColor: get( backgroundColor, 'color' ),
					} }
					isLargeText={ false }
				/>
			</PanelColorGradientSettings>
		</InspectorControls>
	);
}
