import React from 'react';

import {processContent} from 'content/Utils';

import guid from 'dataserverinterface/utils/guid';
import htmlToReactRenderer from 'dataserverinterface/utils/html-to-react';

import hash from 'object-hash';

import SYSTEM_WIDGETS from '../SystemWidgetRegistry';

var SYSTEM_WIDGET_STRATEGIES = {};

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
		var {body, strategies} = props;
		var h = hash(props);
		var widgets = {};
		if (this.state.propHash === h) {
			return;
		}

		strategies = Object.assign({}, SYSTEM_WIDGET_STRATEGIES, strategies);

		body = (body || []).map(content=> {
			var packet;
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

			var processed = packet.body.map(
				part => (typeof part !== 'string') ?
					('<widget id="'+ part.guid +'" data-type="' + part.type + '"></widget>') :
					part);

			return htmlToReactRenderer(
				processed.join(''),
				(n,a) => _isWidget(n,a, packet.widgets));
		});


		this.setState({
			propHash: h,
			body: body,
			widgets: widgets
		});
	},


	render () {
		var props = Object.assign({}, this.props, {body: undefined});
		var {body} = this.state;
		var dynamicRenderers = [];

		props.className = (props.className || '') + ' modeled-content';

		if (Array.isArray(body)) {
			dynamicRenderers = body;
		}
		else {
			props.dangerouslySetInnerHTML = {__html: body};
		}

		/*
		return React.createElement("div", props,
			...dynamicRenderers.map(renderer => renderer(React, this.renderWidget))
		);*/
		return React.createElement.apply(
			React,
			['div', props].concat(dynamicRenderers.map(renderer => renderer(React, this.renderWidget))
		));
	},


	renderWidget (tagName, props, children) {
		var {renderCustomWidget} = this.props;
		var f = renderCustomWidget || React.createElement;
		props = props || {};//ensure we have an object.

		//TODO: Is it known internally? Render it directly.
		var {id} = props;
		var widget = (this.state.widgets || {})[id] || {};

		props = Object.assign({}, props, widget);

		if (widget && SYSTEM_WIDGETS[widget.MimeType]) {
			f = SYSTEM_WIDGETS[widget.MimeType];
		}


		return f(tagName, props, children);
	}
});


function _isWidget (tagName, props, widgets) {
	var widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
