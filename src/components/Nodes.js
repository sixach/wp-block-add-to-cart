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
 * HTML to React parser.
 *
 * @see    https://www.npmjs.com/package/html-react-parser
 */
import parse from 'html-react-parser';

/**
 * The nodes template component.
 * Using The Node, the block processes each product HTML nodes to be displayed on the current page.
 *
 * @param     {Object}         props                Block meta-data properties.
 * @param     {string}         props.className    	The CSS class name(s) that will be added to the wrapper element.
 * @param     {Array}          props.hiddenNodes    Block attributes.
 * @param     {Object}         props.nodes          Element(s) to be rendered after the loop items.
 * @return    {JSX.Element}                         Loop item to render.
 */
function Nodes( { className, hiddenNodes, nodes } ) {
	return <div className={ className }>{ map( omit( nodes, hiddenNodes ), ( node ) => parse( node ) ) }</div>;
}

Nodes.propTypes = {
	className: PropTypes.string,
	hiddenNodes: PropTypes.arrayOf( PropTypes.string ),
	nodes: PropTypes.object,
};

Nodes.defaultProps = {
	className: undefined,
	hiddenNodes: [],
	nodes: {},
};

export default ifCondition( ( { shouldRender } ) => Boolean( shouldRender ) )( Nodes );