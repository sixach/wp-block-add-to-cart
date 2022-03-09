/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see    https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

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
 * The BlockToolbar component is used to render a toolbar that serves as a wrapper for number of options for each block.
 *
 * @see       https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/block-toolbar/README.md
 * @param 	  {Object}   	   props         		  Block meta-data properties.
 * @param 	  {Object} 	       props.attributes       Block attributes.
 * @param     {Function}       props.setAttributes    Update block attributes.
 * @return    {JSX.Element}     					  Inspector element to render.
 */
function Controls( { attributes, setAttributes } ) {
	const { textAlign } = attributes;

	return (
		<BlockControls group="block">
			<AlignmentToolbar onChange={ ( value ) => setAttributes( { textAlign: value } ) } value={ textAlign } />
		</BlockControls>
	);
}

Controls.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
};

Controls.defaultProps = {
	attributes: {},
	setAttributes: () => {},
};

export default ifCondition( ( { shouldRender } ) => Boolean( shouldRender ) )( Controls );
