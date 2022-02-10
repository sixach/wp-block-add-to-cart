/* eslint-disable @wordpress/no-unsafe-wp-apis */

/**
 * Helper React components specific for Sixa projects.
 */
import { NodeList } from '@sixa/wp-block-components';

/**
 * Internationalization utilities for client-side localization.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * This module allows you to create and use standalone block-editor element and components.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import { ContrastChecker, InspectorControls, __experimentalPanelColorGradientSettings } from '@wordpress/block-editor';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';

/**
 * The compose package is a collection of handy Hooks and Higher Order Components (HOCs).
 * The compose function is an alias to `flowRight` from Lodash.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/README.md
 */
import { ifCondition } from '@wordpress/compose';

/**
 * Runtime type checking for React props and similar objects.
 */
import PropTypes from 'prop-types';

/**
 * Inspector Controls appear in the post settings sidebar when a block is being edited.
 *
 * @see 	  https://github.com/WordPress/gutenberg/blob/master/packages/block-editor/src/components/inspector-controls/README.md
 * @param 	  {Object} 	       props 				       Block meta-data properties.
 * @param 	  {Object} 	       props.attributes            Block attributes.
 * @param     {Object}  	   props.backgroundColor 	   An object containing the hex overlay color and a function to update it.
 * @param     {Object}  	   props.backgroundGradient    An object containing the gradient value and a function to update it.
 * @param     {number}         props.maxStockQuantity      The quantity amount available for the selected product.
 * @param     {Object}         props.nodeList              List of HTML nodes to be referred to when each post item looped over.
 * @param     {Function}       props.setAttributes         Update block attributes.
 * @param     {Object}  	   props.textColor 	           An object containing the hex text color and a function to update it.
 * @return    {JSX.Element}     						   Inspector element to render.
 */
function Inspector( { attributes, backgroundColor, backgroundGradient, maxStockQuantity, nodeList, setAttributes, textColor } ) {
	const { hiddenNodes, hideIfOutOfStock, quantity } = attributes;
	const { backgroundColorValue, setBackgroundColor } = backgroundColor;
	const { backgroundGradientValue, setBackgroundGradient } = backgroundGradient;
	const { textColorValue, setTextColor } = textColor;

	return (
		<InspectorControls>
			<PanelBody initialOpen title={ __( 'Button Settings', 'sixa-block-add-to-cart' ) }>
				<RangeControl
					label={ __( 'Quantity', 'sixa-block-add-to-cart' ) }
					max={ maxStockQuantity || undefined }
					min={ 1 }
					onChange={ ( value ) => setAttributes( { quantity: value } ) }
					value={ quantity }
				/>
				<ToggleControl
					checked={ hideIfOutOfStock }
					help={ __( 'Automatically hide the add-to-cart button in case the product is out of stock.', 'sixa-block-add-to-cart' ) }
					label={ __( 'Hide if out of stock?', 'sixa-block-add-to-cart' ) }
					onChange={ () => setAttributes( { hideIfOutOfStock: ! hideIfOutOfStock } ) }
				/>
			</PanelBody>
			<__experimentalPanelColorGradientSettings
				initialOpen={ false }
				settings={ [
					{
						colorValue: textColorValue,
						label: __( 'Text', 'sixa-block-add-to-cart' ),
						onColorChange: setTextColor,
					},
					{
						colorValue: backgroundColorValue,
						gradientValue: backgroundGradientValue,
						label: __( 'Background', 'sixa-block-add-to-cart' ),
						onColorChange: setBackgroundColor,
						onGradientChange: setBackgroundGradient,
					},
				] }
				title={ __( 'Color Settings', 'sixa-block-add-to-cart' ) }
			>
				<ContrastChecker
					{ ...{
						backgroundColor: backgroundColor?.color,
						textColor: textColor?.color,
					} }
					isLargeText={ false }
				/>
			</__experimentalPanelColorGradientSettings>
			<PanelBody initialOpen title={ __( 'Display Settings', 'sixa-block-add-to-cart' ) }>
				<NodeList hiddenNodes={ hiddenNodes } nodeList={ nodeList } onChange={ ( value ) => setAttributes( { hiddenNodes: value } ) } />
			</PanelBody>
		</InspectorControls>
	);
}

Inspector.propTypes = {
	attributes: PropTypes.object.isRequired,
	backgroundColor: PropTypes.exact( {
		backgroundColorValue: PropTypes.string.isRequired,
		setBackgroundColor: PropTypes.func.isRequired,
	} ),
	backgroundGradient: PropTypes.exact( {
		backgroundGradientValue: PropTypes.string.isRequired,
		setBackgroundGradient: PropTypes.func.isRequired,
	} ),
	maxStockQuantity: PropTypes.number,
	setAttributes: PropTypes.func.isRequired,
	textColor: PropTypes.exact( {
		textColorValue: PropTypes.string.isRequired,
		setTextColor: PropTypes.func.isRequired,
	} ),
};

Inspector.defaultProps = {
	attributes: {},
	backgroundColor: {},
	backgroundGradient: {},
	maxStockQuantity: undefined,
	setAttributes: () => {},
	textColor: {},
};

export default ifCondition( ( { shouldRender } ) => Boolean( shouldRender ) )( Inspector );
