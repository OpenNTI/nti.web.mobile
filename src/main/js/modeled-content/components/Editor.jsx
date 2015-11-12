import React from 'react';

import {hasClass, matches, parent} from 'nti.lib.dom';

import InsertImageButton from './InsertImageButton';
import InsertVideoButton from './InsertVideoButton';
import Editor, {FormatButton, ToolbarRegions} from 'react-editor-component';

import selectRenderer from './editor-parts';

const {SOUTH} = ToolbarRegions;

const WHITESPACE_ENTITIES_AND_TAGS = /((<[^>]+>)|&nbsp;|[\s\r\n])+/ig;

function renderPart (data) {
	if (typeof data === 'string') {
		return data;
	}

	const Renderer = selectRenderer(data);
	return Renderer.renderIcon(data).then(markup => `\u200B${markup}\u200B`);
}

export default React.createClass({
	displayName: 'ModeledBodyContentEditor',


	statics: {

		isEmpty (html) {
			if (!Array.isArray(html)) {
				html = [html];
			}

			// This filter fn will return true if:
			// 1) x is not 'null' AND:
			// 2a) x is not a string OR
			// 2b) is a string that does not reduce to lenth 0
			let empties = x=>
				x && (typeof x !== 'string' || x.replace(WHITESPACE_ENTITIES_AND_TAGS, '').length);

			return html.filter(empties).length === 0;
		}

	},


	propTypes: {
		children: React.PropTypes.any,

		allowInsertImage: React.PropTypes.bool,
		allowInsertVideo: React.PropTypes.bool,

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


	getInitialState () {
		return {};
	},


	getDefaultProps () {
		return {
			allowInsertImage: true,
			allowInsertVideo: false
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


	componentWillMount () {
		this.setupValue();
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setupValue(nextProps);
		}
	},


	setupValue (props = this.props) {
		const {value} = props;
		if (!value) {
			return this.setState({value});
		}

		let res = value;
		if (!Array.isArray(res)) {
			res = [res];
		}

		this.pendingSetup = Promise.all(res.map(renderPart))
			.then(result => {
				this.setState({
					value: result.join('\n').replace(/<(\/?)(body|html)>/ig, '')
				});
			});
	},


	onPrepareValueChunk (markup) {
		return markup;
	},


	onPartValueParse (markup) {
		let d = document.createElement('div');
		d.innerHTML = markup;

		let scripts = Array.from(d.querySelectorAll('script[type$=json]'));
		const {length: numberFound} = scripts;

		if (numberFound === 0) {
			//return 'undefined' so the caller knows we didn't do anything.
			return void 0;
		}

		for (let index = 0; index < numberFound; index++) {
			let script = scripts[index];
			scripts[index] = JSON.parse(script.textContent);

			while (script.parentNode !== d) {
				script = script.parentNode;
			}

			let placeHolder = document.createElement('placeholder');

			d.insertBefore(placeHolder, script);
			d.removeChild(script);
		}

		scripts = scripts.reverse();

		let result = d.innerHTML.split(/<(placeholder)[^>]*>(?:<\/placeholder>)?/i)
			.map(x => x === 'placeholder' ? scripts.pop() : x.replace(/\u200B|\u2060/ig, ''));

		return result;
	},


	onInsertionHook (editorNode, range, newNode) {
		let node = (x=> (!x ? x : x.nodeType === 3 ? x.parentNode : x))(range.startContainer);

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
		const {props: {allowInsertImage, allowInsertVideo, children}, state: {value}} = this;

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

				{!allowInsertVideo ? null : (
					<InsertVideoButton region={SOUTH}/>
				)}

				<div className="right-south" region={SOUTH}>
					{children}
				</div>
			</Editor>
		);
	}
});
