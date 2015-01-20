'use strict';

var React = require('react/addons');

var {processContent} = require('content/Utils');

var guid = require('dataserverinterface/utils/guid');
var htmlToReactRenderer = require('dataserverinterface/utils/html-to-react');

var hash = require('object-hash');

var SYSTEM_WIDGETS = require('../SystemWidgetRegistry');

var SYSTEM_WIDGET_STRATEGIES = {};

/**
 * Component to render Modeled Body Content
 */
module.exports = React.createClass({
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
			var key, w, o;
			if (typeof content === 'string') {
				packet = processContent(strategies, {content: content});
			}
			else {
				key = guid();
				w = Object.assign({}, content, { id: key });
				o = {}; o[key] = w;
				packet = {
					widgets: o,
					body: [{
						guid:key,
						type: w.MimeType
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


	render: function() {
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


	renderWidget: function (tagName, props, children) {
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
