/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Import icons from the WordPress icon library.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/icons/README.md
 */
import { edit } from '@wordpress/icons';

/**
 * This packages includes a library of generic WordPress components to be used for
 * creating common UI elements shared between screens and features of the WordPress dashboard.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

/**
 * The BlockToolbar component is used to render a toolbar that serves as a wrapper for number of options for each block.
 *
 * @see     https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-toolbar/README.md
 * @param   {Object}    props 					    Block meta-data properties.
 * @param   {Object}    props.attributes 		    Block attributes.
 * @param   {Function}  props.setAttributes 	    Update block attributes.
 * @param   {Function}  props.toggleEditing 		Update the editing state value.
 * @return 	{WPElement} 						    Toolbar element to render.
 */
export default function Controls( { attributes, setAttributes, toggleEditing } ) {
	const { textAlign } = attributes;

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton icon={ edit } className="components-toolbar__control" label={ __( 'Edit', 'sixa' ) } onClick={ toggleEditing } />
				</ToolbarGroup>
			</BlockControls>
			<BlockControls group="other">
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => {
						setAttributes( { textAlign: value } );
					} }
				/>
			</BlockControls>
		</>
	);
}
