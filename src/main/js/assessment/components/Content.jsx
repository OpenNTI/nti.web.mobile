import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

import {processContent} from 'content/utils';

import isFunction from 'nti.lib.interfaces/utils/isfunction';
import htmlToReact from 'nti.lib.interfaces/utils/html-to-react';

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
		content: React.PropTypes.string.isRequired,

		renderCustomWidget: React.PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillMount () { this.buildContent(this.props); },


	componentWillReceiveProps (props) {
		if (props.content !== this.props.content) {
			this.buildContent(props);
		}
	},


	buildContent (props) {
		let {content, strategies} = props;

		let widgets;

		if (strategies) {
			let packet = processContent({content}, strategies);
			widgets = packet.widgets;

			content = packet.body.map(part=>
				(typeof part === 'string') ? part : `<widget id="${part.guid}">--x--</widget>`
			).join('');

			content = htmlToReact(content, (n, a)=>isWidget(n, a, widgets));
		}

		this.setState({
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

		return React.createElement('div', props, dynamicRender(React, this.renderWidget));
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
