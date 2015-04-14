import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

import {processContent} from 'content/Utils';

import isFunction from 'nti.lib.interfaces/utils/isfunction';
import htmlToReact from 'nti.lib.interfaces/utils/html-to-react';

import hash from 'object-hash';


/**
 * Common component to render question and part content alike.
 * Keeping all assessment content-manipulation under one component.
 *
 * TODO: Implement Audio Snippets
 * maybe Sequences?
 */
export default React.createClass({
	displayName: 'Content',

	propTypes: {
		renderCustomWidget: React.PropTypes.func
	},


	getInitialState () {
		return {
			propHash: null
		};
	},


	componentDidMount () { this.buildContent(this.props); },


	componentWillReceiveProps (props) { this.buildContent(props); },


	buildContent (props) {
		let {content, strategies} = props;
		let packet = hash(props);
		let widgets;
		let h = hash(props);

		if (this.state.propHash === h) {
			return;
		}


		if (strategies) {
			packet = processContent(strategies, {content: content});
			widgets = packet.widgets;

			content = packet.body.map(part=>
				(typeof part === 'string') ?
					part : ('<widget id="'+ part.guid +'">--x--</widget>')
			).join('');

			content = htmlToReact(content, (n, a)=>isWidget(n, a, widgets));
		}

		this.setState({
			propHash: h,
			content: content,
			widgets: widgets
		});
	},


	render () {
		let props = Object.assign({}, this.props, {content: undefined});
		let dynamicRender = emptyFunction;
		if (isFunction(this.state.content)) {
			dynamicRender = this.state.content;
		} else {
			props.dangerouslySetInnerHTML = {__html: this.state.content || ''};
		}

		return React.createElement("div", props, dynamicRender(React, this.renderWidget));
	},


	renderWidget (tagName, props, children) {
		props = props || {};//ensure we have an object.

		//TODO: Is it known internally? Renderit directly.
		let {id} = props;
		let {widgets} = this.state;
		let {renderCustomWidget} = this.props;

		let widget = (widgets || {})[id] || {};

		let f = renderCustomWidget || React.createElement;

		props = Object.assign({}, props, widget);
		return f(tagName, props, children);
	}
});


function isWidget (tagName, props, widgets) {
	let widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
