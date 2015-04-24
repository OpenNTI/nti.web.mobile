import React from 'react';

import hasClass from 'nti.lib.dom/lib/hasclass';
import matches from 'nti.lib.dom/lib/matches';
import parent from 'nti.lib.dom/lib/parent';

import InsertImageButton from './InsertImageButton';
import Editor, {FormatButton, ToolbarRegions} from 'react-editor-component';

const {SOUTH} = ToolbarRegions;

export default React.createClass({
	displayName: 'ModeledBodyContentEditor',

	propTypes: {
		allowInsertImage: React.PropTypes.bool,

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


	getDefaultProps () {
		return {
			allowInsertImage: true
		};
	},


	/**
	 * @returns {Object|String} the modeled body array, where each item in
	 * the array is either a modeled content object (Whiteboard, embedded
	 * Video, etc) or an html fragment. (The server 'tidies' the fragment
	 * into a complete document complete with <html><body> tags... be
	 * aware that those come back..)
	 *
	 * @note: We can typically ignore the superfluous wrapper tags, but
	 * this will do its best to handle them.
	 */
	getValue () {
		return this.refs.editor.getValue();
	},


	onPrepareValueChunk (markup/*, node*/) {
		/*
		if (div.is('.object-part')) {
			html = '';
			dom = Ext.getDom(div);
		}
		else {
			div = div.down('.object-part');
			if (div) {
				html = '';
				dom = Ext.getDom(div);
			}
		}

		if (!html && Ext.fly(dom).hasCls('object-part')) {
			tmp = document.createElement('div');
			tmp.appendChild(dom);
			html = tmp.innerHTML || '';
		}
		*/
		return markup;
	},


	onPartValueParse (markup) {
		let d = document.createElement('div');
		d.innerHTML = markup;
		let script = d.querySelector('script[type$=json]');

		let result = script ? JSON.parse(script.textContent) : markup;

		return result;
	},


	onInsertionHook (editorNode, range, newNode) {
		let node = (x=> (!x ? x : x.nodeType===3 ? x.parentNode : x))(range.startContainer);

		if (hasClass(node, 'body-divider') || matches(node, '.body-divider *') || newNode.querySelector('.body-divider')) {

			let part = parent(node, '.body-divider') || node;

			//get the next sibling so insertBefore will be after the body divider
			part = part && part.nextSibling;

			if (part && editorNode.contains(part)) {
				//if there is a part, insert before it
				editorNode.insertBefore(newNode, part);
			} else {
				// otherwise just append it to the editorNode
				editorNode.appendChild(newNode);
			}

			return true;
		}

		return false;
	},


	render () {
		//TODO: parse/build value sent to the RTE from the modeled body.
		let {value, allowInsertImage} = this.props;

		if (Array.isArray(value)) {
			value = value.join('\n').replace(/<(\/?)(body|html)>/ig, '');
		}

		return (
			<Editor className="modeled content editor" value={value}
				onInsertionHookCallback={this.onInsertionHook}
				onPrepareValueChunkCallback={this.onPrepareValueChunk}
				onPartValueParseCallback={this.onPartValueParse}
				onChange={this.props.onChange}
				onBlur={this.props.onBlur}
				ref="editor">
				<FormatButton format="bold" region={SOUTH}/>
				<FormatButton format="italic" region={SOUTH}/>
				<FormatButton format="underline" region={SOUTH}/>

				{!allowInsertImage ? null : (
					<InsertImageButton region={SOUTH}/>
				)}

			</Editor>
		);
	}
});
