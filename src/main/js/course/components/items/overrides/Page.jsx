import {resolve} from 'path';

import React from 'react';
import PropTypes from 'prop-types';

import {Component as ContextSender} from 'common/mixins/ContextSender';

function isConstrained (next) {
	const {item} = next || {};

	return item.isOutlineNode && item.contentIsConstrained;
}

export default class CourseItemOverridePage extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		children: PropTypes.any,
		returnPath: PropTypes.string,
		lessonInfo: PropTypes.shape({
			title: PropTypes.string
		})
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				history: null
			}
		};
	}

	getReturnTo () {
		const {lessonInfo, returnPath} = this.props;
		const {title} = lessonInfo || {};

		return {
			label: title || '',
			href: returnPath
		};
	}



	render () {
		const {children} = this.props;


		return (
			<ContextSender getContext={getContext} {...this.props}>
				{children}
			</ContextSender>
		);
	}
}

function getContext () {
	const context = this;
	const {lessonInfo, location, returnPath, next, previous} = context.props;
	const {getRouteFor, baseroute} = context.context.router;
	const {title} = lessonInfo || {};

	const getHref = (item, itemContext) => {
		const itemRoute = getRouteFor(item, itemContext);

		return resolve(baseroute, itemRoute);
	};

	return {
		returnOverride: {
			label: title || '',
			href: returnPath
		},
		ntiid: lessonInfo.outlineNodeId,
		pagerProps: {
			root: lessonInfo && lessonInfo.outlineNodeId,
			current: location && location.item && location.item.getID(),
			currentIndex: lessonInfo && lessonInfo.currentItemIndex,
			total: lessonInfo && lessonInfo.totalItems,
			next: {
				href: next && next.item && !isConstrained(next) ? getHref(next.item, next) : null,
				title: 'Next Item'
			},
			prev: {
				href: previous && previous.item && !isConstrained(previous) ? getHref(previous.item, previous) : null,
				title: 'Previous Item'
			}
		}
	};
}

