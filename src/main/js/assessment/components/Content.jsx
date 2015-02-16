'use strict';

var React = require('react');
var emptyFunction = require('react/lib/emptyFunction');

var {processContent} = require('content/Utils');

var isFunction = require('dataserverinterface/utils/isfunction');
var htmlToReact = require('dataserverinterface/utils/html-to-react');

var hash = require('object-hash');


/**
 * Common component to render question and part content alike.
 * Keeping all assessment content-manipulation under one component.
 *
 * TODO: Implement Audio Snippets
 * maybe Sequences?
 */
module.exports = React.createClass({
	displayName: 'Content',

	propTypes: {
		renderCustomWidget: React.PropTypes.func
	},


	getInitialState: function() {
		return {
			propHash: null
		};
	},


	componentDidMount: function() { this.buildContent(this.props); },


	componentWillReceiveProps: function(props) { this.buildContent(props); },


	buildContent: function (props) {
		var {content, strategies} = props;
		var packet = hash(props);
		var widgets;
		var h = hash(props);

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

			content = htmlToReact(content, (n,a)=>_isWidget(n,a,widgets));
		}

		this.setState({
			propHash: h,
			content: content,
			widgets: widgets
		});
	},


	render: function() {
		var props = Object.assign({}, this.props, {content: undefined});
		var dynamicRender = emptyFunction;
		if (isFunction(this.state.content)) {
			dynamicRender = this.state.content;
		} else {
			props.dangerouslySetInnerHTML = {__html: this.state.content};
		}

		return React.createElement("div", props, dynamicRender(React, this.renderWidget));
	},


	renderWidget: function (tagName, props, children) {
		props = props || {};//ensure we have an object.

		//TODO: Is it known internally? Renderit directly.
		var {id} = props;
		var {widgets} = this.state;
		var {renderCustomWidget} = this.props;

		var widget = (widgets || {})[id] || {};

		var f = renderCustomWidget || React.createElement;

		props = Object.assign({}, props, widget);
		return f(tagName, props, children);
	}
});


function _isWidget (tagName, props, widgets) {
	var widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
