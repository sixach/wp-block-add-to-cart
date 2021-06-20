/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { RichText } from '@wordpress/block-editor';

/**
 * AddToCart is a React component that could be displayed in place of the actual button.
 *
 * @see 	https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @param 	{Object}    props 					    Block meta-data properties.
 * @param 	{string}    props.className 		    Classname(s) to apply to the component.
 * @param 	{string}    props.value 		        HTML string to make editable.
 * @param 	{string}    props.ariaLabel 	        The aria-label attribute is used to define a string that labels the current element.
 * @param 	{string}    props.placeholder 	        Placeholder text to show when the field is empty.
 * @param 	{Function}  props.onChange 	        	Called when the value changes.
 * @param 	{Object}    props.style 		        CSS inline styles.
 * @return 	{WPElement} 						    Element to render.
 */
export default function AddToCart( { className, value, ariaLabel, placeholder, onChange, style } ) {
	return (
		<RichText
			preserveWhiteSpace
			keepPlaceholderOnFocus
			withoutInteractiveFormatting
			identifier="text"
			value={ value }
			multiline={ false }
			allowedFormats={ [] }
			__unstableOnSplitAtEnd={ [] }
			aria-label={ ariaLabel }
			placeholder={ placeholder }
			onChange={ onChange }
			className={ className }
			style={ style }
		/>
	);
}
