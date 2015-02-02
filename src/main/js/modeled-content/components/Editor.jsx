import Editor from 'react-editor-component';
import React from 'react/addons';

export default React.createClass({
	displayName: 'ModeledBodyContentEditor',

	propTypes: {
		/**
		 * The raw or parsed modeled content body.
		 *
		 * @type {String|Array[String|Object]}
		 */
		value: React.PropTypes.oneOfType([

			React.PropTypes.string,

			React.PropTypes.arrayOf(React.PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.object
				]))
			]),


		onBlur: React.PropTypes.func,

		
		onChange: React.PropTypes.func
	},


	/**
	 * @returns the modeled body array, where each item in the array is either
	 *  a modeled content object (Whiteboard, embedded Video, etc) or an html
	 *  fragment. (The server 'tidies' the fragment into a complete document
	 *  complete with <html><body> tags... be aware that those come back..)
	 *
	 * @note: We can typically ignore the superfluous tags wrapper tags, but
	 * this will do its best to handle them.
	 */
	getValue () {
		return this.refs.editor.getValue();
	},


	render () {
		//TODO: parse/build value sent to the RTE from the modeled body.
		var {value} = this.props;

		if (Array.isArray(value)) {
			value = value.join('\n').replace(/<(\/?)(body|html)>/ig,'');
		}

		return (
			<Editor className="modeled content editor" value={value}
				onChange={this.props.onChange} onBlur={this.props.onBlur} ref="editor"/>
		);
	}
});
