/**
 * Utility for libraries from the `Lodash`.
 */
import { nth, invoke } from 'lodash';

/**
 * Helpers.
 */
const utils = {
	blockClassName: ( classNames ) => nth( invoke( classNames, 'match', /wp-block-[^{\s]*/ ), 0 ),
};

export default utils;
