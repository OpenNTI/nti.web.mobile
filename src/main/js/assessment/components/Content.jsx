import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

import {processContent} from 'content/utils';

import isFunction from 'nti-lib-interfaces/lib/utils/isfunction';
import htmlToReact from 'nti-lib-interfaces/lib/utils/html-to-react';

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

		renderCustomWidget: React.PropTypes.func,

		strategies: React.PropTypes.object
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
		const {content, strategies} = props;

		let work = Promise.resolve({content, widgets: void 0});

		if (strategies) {
			work = processContent({content}, strategies)
				.then(packet => {
					const {widgets, body} = packet;
					const markup = body.map(part=>

						(typeof part === 'string')
							? part
							: `<widget id="${part.guid}">--x--</widget>`

					).join('');

					return {widgets, content: htmlToReact(markup, (n, a)=>isWidget(n, a, widgets))};
				})
				.catch(()=> ({content, widgets: void 0}));
		}

		//This isn't a complete fix, and I'm concerned it may create a problem for
		//content that processes faster than the initial render.  If this setState
		//callback is called before componentDidMount is run, this will not set the state.
		work.then(state => this.refs.el && this.setState(state));
	},


	render () {
		let props = Object.assign({}, this.props, {ref: 'el', content: undefined});
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

		let {id} = props; //eslint-disable-line react/prop-types
		let {widgets} = this.state;
		let {renderCustomWidget} = this.props;

		//TODO: Is it known internally? Renderit directly.

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
