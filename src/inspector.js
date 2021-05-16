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
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { PanelBody, RangeControl } from '@wordpress/components';

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
 * @return 	{WPElement} 						        Inspector element to render.
 */
export default function Inspector( { attributes, setAttributes, textColor, setTextColor, backgroundColor, setBackgroundColor, useGradient, stockQuantity } ) {
	const { quantity } = attributes;
	const { setGradient, gradientValue } = useGradient;

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
			</PanelBody>
			<PanelColorGradientSettings
				initialOpen
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
