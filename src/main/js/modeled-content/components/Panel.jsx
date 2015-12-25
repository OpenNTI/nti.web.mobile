import React from 'react';
import nullRender from 'fbjs/lib/emptyFunction';

import {getHTMLSnippet, filterContent, processContent} from 'content/utils';

import uuid from 'node-uuid';
import htmlToReactRenderer from 'nti.lib.interfaces/lib/utils/html-to-react';

import hash from 'object-hash';

import SYSTEM_WIDGETS from '../SystemWidgetRegistry';

let SYSTEM_WIDGET_STRATEGIES = {};

/**
 * Component to render Modeled Body Content
 */
export default React.createClass({
	displayName: 'ModeledBodyContent',

	propTypes: {
		body: React.PropTypes.array,

		previewMode: React.PropTypes.bool,
		previewLength: React.PropTypes.number,

		strategies: React.PropTypes.object,
		widgets: React.PropTypes.object,
		renderCustomWidget: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			previewLength: 36,
			previewMode: false
		};
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
		let {body, strategies, previewLength, previewMode} = props;
		let h = hash(props);
		let widgets = {};
		let letterCount = 0;
		if (this.state.propHash === h) {
			return;
		}

		strategies = Object.assign({}, SYSTEM_WIDGET_STRATEGIES, strategies);

		body = (body || []).map(content=> {
			if (previewMode && previewLength <= letterCount) {
				return nullRender;
			}

			let packet;
			if (typeof content === 'string') {
				if (previewMode) {
					content = filterContent(content);
					content = getHTMLSnippet(content, previewLength - letterCount);
				}
				packet = processContent({content}, strategies);
			}
			else {
				let key = uuid.v4();
				let o = {[key]: Object.assign({}, content, { id: key })};

				packet = {
					widgets: o,
					body: [{
						guid: key,
						type: o[key].MimeType
					}]
				};
			}

			if (previewMode) {
				letterCount += packet.body
								.map(x=> typeof x !== 'string' ? 0 :
									x
									.replace(/<[^>]*>/g, ' ')//replace all markup with spaces.
									.replace(/\s+/g, ' ') //replace all spanning whitespaces with a single space.
									.length
								)
								.reduce((sum, x)=> sum + x);
			}

			Object.assign(widgets, packet.widgets);

			let processed = packet.body.map(
				part => (typeof part !== 'string') ?
					`<widget id="${part.guid}" data-type="${part.type}"></widget>` : part);

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

		return React.createElement('div', props,
			...dynamicRenderers.map(renderer => renderer(React, this.renderWidget))
		);
	},


	renderWidget (tagName, props, children) {
		let {renderCustomWidget, widgets} = this.props;
		let f = renderCustomWidget || React.createElement;
		props = props || {};//ensure we have an object.

		//TODO: Is it known internally? Render it directly.
		let {id} = props;//eslint-disable-line react/prop-types
		let widget = (this.state.widgets || {})[id] || {};

		props = Object.assign({}, props, {widget});

		widgets = Object.assign({}, SYSTEM_WIDGETS, widgets);

		if (widget && widgets[widget.MimeType]) {
			f = widgets[widget.MimeType];
		}


		return f(tagName, props, children);
	}
});


function isWidget (tagName, props, widgets) {
	let widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
