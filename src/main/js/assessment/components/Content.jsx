import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getEventTarget} from '@nti/lib-dom';
import {processContent} from '@nti/lib-content-processing';
import htmlToReact from 'html-reactifier';

const isFunction = f => typeof f === 'function';

/*
 * Common component to render question and part content alike.
 * Keeping all assessment content-manipulation under one component.
 *
 * TODO: Implement Audio Snippets
 * maybe Sequences?
 */
export default class Content extends React.Component {

	static propTypes = {
		className: PropTypes.string,

		content: PropTypes.string.isRequired,

		renderCustomWidget: PropTypes.func,

		strategies: PropTypes.object
	}


	state = {}


	componentWillMount () { this.buildContent(this.props); }


	componentWillReceiveProps (props) {
		if (props.content !== this.props.content) {
			this.buildContent(props);
		}
	}


	onClick = (e) => {
		const {onClick} = this.props; //eslint-disable-line react/prop-types
		if (onClick) {
			onClick(e);
		}

		const anchor = getEventTarget(e, 'a[href]');
		if (anchor && !e.isDefaultPrevented() && !e.isPropagationStopped()) {
			anchor.setAttribute('target', '_blank');
		}
	}


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


			work = processContent({content}, strategies)
				.then(postProcess)
				.catch(()=> ({content, widgets: void 0}));
		}

		if (work && work.then) {
			work.then(finish);
		} else {
			finish(work);
		}
	}


	render () {
		let className = cx('assessment-content-component', this.props.className);

		const props = {
			...this.props,
			className,
			onClick: this.onClick,
			ref: 'el'
		};


		delete props.content;
		delete props.renderCustomWidget;


		let dynamicRender = () => {};
		if (isFunction(this.state.content)) {
			dynamicRender = this.state.content;
		} else {
			props.dangerouslySetInnerHTML = {__html: this.state.content || ''};
		}

		return React.createElement('div', props, dynamicRender(React, this.renderWidget));
	}


	renderWidget = (tagName, props, children) => {
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
}


function isWidget (tagName, props, widgets) {
	let widget = widgets && widgets[props && props.id];
	return (tagName === 'widget' && widget) ? tagName : null;
}
