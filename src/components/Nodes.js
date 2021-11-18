/**
 * Utility for libraries from the `Lodash`.
 */
import { map, omit } from 'lodash';

/**
 * Runtime type checking for React props and similar objects.
 */
import PropTypes from 'prop-types';

/**
 * The compose package is a collection of handy Hooks and Higher Order Components (HOCs).
 * The compose function is an alias to `flowRight` from Lodash.
 *
 * @see    https://github.com/WordPress/gutenberg/blob/trunk/packages/compose/README.md
 */
import { ifCondition } from '@wordpress/compose';

/**
 * EventManager for JavaScript.
 * Hooks are used to manage component state and lifecycle.
 *
 * @see    https://developer.wordpress.org/block-editor/reference-guides/packages/packages-hooks/
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * HTML to React parser.
 *
 * @see    https://www.npmjs.com/package/html-react-parser
 */
import parse from 'html-react-parser';

/**
 * The nodes template component.
 * Using The Node, the block processes each product HTML nodes to be displayed on the current page.
 *
 * @param     {Object}         props               Block meta-data properties.
 * @param     {Object}         props.attributes    Block attributes.
 * @param     {string}         props.className     The CSS class name(s) that will be added to the wrapper element.
 * @param     {Object}         props.nodes         Element(s) to be rendered after the loop items.
 * @return    {JSX.Element}                        Meta functions to render.
 */
function Nodes( { attributes, className, nodes } ) {
	const { hiddenNodes } = attributes;

	return (
		<div className={ className }>
			{ applyFilters( 'sixa.addToCartBeforeNodeFunctions', null, attributes ) }
			{ map( omit( nodes, hiddenNodes ), ( node ) => parse( node ) ) }
			{ applyFilters( 'sixa.addToCartAfterNodeFunctions', null, attributes ) }
		</div>
	);
}

Nodes.propTypes = {
	attributes: PropTypes.object.isRequired,
	className: PropTypes.string,
	nodes: PropTypes.object,
};

Nodes.defaultProps = {
	attributes: {},
	className: undefined,
	nodes: {},
};

export default ifCondition( ( { shouldRender } ) => Boolean( shouldRender ) )( Nodes );
