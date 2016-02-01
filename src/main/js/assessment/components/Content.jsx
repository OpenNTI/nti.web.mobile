import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';

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
		className: React.PropTypes.string,

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

		//We're back to the original bug.. HOWEVER, processContent
		//will LIKELY return synchronously 100% of the time for
		//this components use case
		const finish = state => this.setState(state);

		let work = {content, widgets: void 0};

		if (strategies) {
			const postProcess = packet => {
				const {widgets, body} = packet;
				const markup = body.map(part=>
					(typeof part === 'string')
						? part
						: `<widget id="${part.guid}">--x--</widget>`
					).join('');

				return {widgets, content: htmlToReact(markup, (n, a)=>isWidget(n, a, widgets))};
			};

			work = processContent({content}, strategies);

			if (work && work.then) {
				work = work.then(postProcess)
					.catch(()=> ({content, widgets: void 0}));
			} else {
				work = postProcess(work);
			}
		}

		if (work && work.then) {
			work.then(finish);
		} else {
			finish(work);
		}
	},


	render () {
		let className = cx('assessment-content-component', this.props.className);

		let props = Object.assign({}, this.props, {className, ref: 'el', content: undefined});

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
