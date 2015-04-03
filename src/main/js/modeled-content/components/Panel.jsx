import React from 'react';

import {processContent} from 'content/Utils';

import guid from 'nti.lib.interfaces/utils/guid';
import htmlToReactRenderer from 'nti.lib.interfaces/utils/html-to-react';

import hash from 'object-hash';

import SYSTEM_WIDGETS from '../SystemWidgetRegistry';

let SYSTEM_WIDGET_STRATEGIES = {};

/**
 * Component to render Modeled Body Content
 */
export default React.createClass({
	displayName: 'ModeledBodyContent',

	propTypes: {
		body: React.PropTypes.array.isRequired,

		strategies: React.PropTypes.object,
		renderCustomWidget: React.PropTypes.func
	},


	getInitialState () {
		return {
			body: [],
			propHash: null
		};
	},


	componentDidMount () { this.buildContent(this.props); },
	componentWillReceiveProps (props) { this.buildContent(props); },


	buildContent (props) {
		let {body, strategies} = props;
		let h = hash(props);
		let widgets = {};
		if (this.state.propHash === h) {
			return;
		}

		strategies = Object.assign({}, SYSTEM_WIDGET_STRATEGIES, strategies);

		body = (body || []).map(content=> {
			let packet;
			if (typeof content === 'string') {
				packet = processContent(strategies, {content: content});
			}
			else {
				let key = guid();
				let o = {[key]: Object.assign({}, content, { id: key })};

				packet = {
					widgets: o,
					body: [{
						guid: key,
						type: o[key].MimeType
					}]
				};
			}

			Object.assign(widgets, packet.widgets);

			let processed = packet.body.map(
				part => (typeof part !== 'string') ?
					('<widget id="'+ part.guid +'" data-type="' + part.type + '"></widget>') :
					part);

			return htmlToReactRenderer(
				processed.join(''),
				(n, a) => isWidget(n, a, packet.widgets));
		});


		this.setState({
			propHash: h,
			body: body,
			widgets: widgets
		});
	},


	render () {
		let props = Object.assign({}, this.props, {body: undefined});
		let {body} = this.state;
		let dynamicRenderers = [];

		props.className = (props.className || '') + ' modeled-content';

		if (Array.isArray(body)) {
			dynamicRenderers = body;
		}
		else {
			props.dangerouslySetInnerHTML = {__html: body || ''};
		}

		return React.createElement("div", props,
			...dynamicRenderers.map(renderer => renderer(React, this.renderWidget))
		);
	},


	renderWidget (tagName, props, children) {
		let {renderCustomWidget} = this.props;
		let f = renderCustomWidget || React.createElement;
		props = props || {};//ensure we have an object.

		//TODO: Is it known internally? Render it directly.
		let {id} = props;
		let widget = (this.state.widgets || {})[id] || {};

		props = Object.assign({}, props, {widget});

		if (widget && SYSTEM_WIDGETS[widget.MimeType]) {
			f = SYSTEM_WIDGETS[widget.MimeType];
		}


		return f(tagName, props, children);
	}
});


function isWidget (tagName, props, widgets) {
	let widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
