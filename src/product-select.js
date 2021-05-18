/**
 * Utility for libraries from the `Lodash`.
 */
import { noop } from 'lodash';

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
import { Placeholder, Flex, FlexBlock, FlexItem, ComboboxControl, Button } from '@wordpress/components';

/**
 * Import icons from the WordPress icon library.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/icons/README.md
 */
import { Icon, edit } from '@wordpress/icons';

/**
 * ProductSelect is a React component that could be displayed in place of the actual data.
 * This can be used to represent an example state prior to any actual block content being placed.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	{Object}    props 					    Block meta-data properties.
 * @param 	{string}    props.label 		        The label for the control.
 * @param 	{string}    props.instructions 		    The help text that will be displayed as the content.
 * @param 	{string}    props.productValue 	        The current value of the `Product` dropdown menu.
 * @param 	{Function}  props.onChange 	        	Callback method for the `Product` dropdown menu.
 * @param 	{Array}     props.productOptions 	    The product options that can be chosen from.
 * @param 	{Function}  props.toggleEditing 		Toggle the placeholder component view.
 * @return 	{WPElement} 						    Element to render.
 */
function ProductSelect( { label, instructions, productValue, productOptions, onChange, toggleEditing } ) {
	return (
		<>
			<Placeholder label={ label } instructions={ instructions } icon={ <Icon icon={ edit } /> }>
				<Flex align="top">
					<FlexBlock className="sixa-product-select">
						<ComboboxControl
							allowReset={ false }
							value={ productValue }
							options={ productOptions }
							onFilterValueChange={ noop }
							onChange={ onChange }
						/>
					</FlexBlock>
					<FlexItem>
						<Button isPrimary disabled={ ! productValue } onClick={ toggleEditing }>
							{ __( 'Done', 'sixa' ) }
						</Button>
					</FlexItem>
				</Flex>
			</Placeholder>
		</>
	);
}

export default ProductSelect;
