import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { decodeFromURI, encodeForURI } from '@nti/lib-ntiids';
import { Content, Overview } from '@nti/web-course';
import { getHistory } from '@nti/web-routing';

import overrides from './overrides';
import Styles from './View.css';

const cx = classnames.bind(Styles);

const TRIM_REGEX = /^.*\/items/;
const NEW_ROUTE_REPLACE_REGEX = /\/items\/.*$/;

function getRouteParts(path) {
	try {
		const trimmed = path.replace(TRIM_REGEX, '');
		const parts = trimmed.split('/');

		let selection = [];
		let discussions = false;

		for (let part of parts) {
			if (!part) {
				continue;
			}
			if (part === 'discussions') {
				discussions = true;
				break;
			}

			selection.push(decodeFromURI(part));
		}

		return {
			selection,
			discussions,
		};
	} catch (e) {
		return null;
	}
}

function getURLPart(obj) {
	return encodeForURI(
		obj.getId ? obj.getId() : obj.getID ? obj.getID() : obj.NTIID
	);
}

function getOverviewPart(obj, context) {
	if (obj.isTableOfContentsNode) {
		const { relatedWorkRef } = context;

		return relatedWorkRef
			? `${getOverviewPart(relatedWorkRef)}/${getURLPart(obj)}`
			: getURLPart(obj);
	}

	if (obj.isVideo) {
		const ref = obj.getLinkProperty('ref', 'RefNTIID');
		return ref ? encodeForURI(ref) : getURLPart(obj);
	}

	return getURLPart(obj);
}

function getFullRoute(lesson, obj, context) {
	return `${getURLPart(lesson)}/items/${getOverviewPart(obj, context)}`;
}

export default class CourseItems extends React.Component {
	static getOverviewPart = getOverviewPart;
	static getFullRoute = getFullRoute;

	static propTypes = {
		course: PropTypes.object,
		outlineId: PropTypes.string,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	static childContextTypes = {
		router: PropTypes.object,
	};

	getChildContext() {
		const { router: nav } = this.context;

		return {
			router: {
				...(nav || {}),
				baseroute: nav && nav.makeHref(''),
				history: getHistory(),
				getRouteFor: this.getItemRouteFor, //this.getRouteFor,
			},
		};
	}

	getItemRouteFor = (obj, context) => {
		if (obj.isOutlineNode) {
			return `${getURLPart(obj)}/`;
		}

		const { outlineId } = this.props;
		const { lesson: lessonOverride } = context || {};
		const lesson = {
			NTIID: lessonOverride
				? lessonOverride.ContentNTIID
				: decodeFromURI(outlineId),
		};

		return getFullRoute(lesson, obj, context);
	};

	getReturnPath() {
		const path = this.getPath();
		const returnPath = path.replace(NEW_ROUTE_REPLACE_REGEX, '');

		return this.context.router.makeHref(returnPath);
	}

	getPath() {
		return this.context.router.getPath();
	}

	getRouteParts() {
		return getRouteParts(this.getPath());
	}

	getLessonId() {
		const { match } = this.context.router.getMatch();

		return match.outlineId ? decodeFromURI(match.outlineId) : null;
	}

	render() {
		const { course, ...otherProps } = this.props;
		const { selection } = this.getRouteParts();
		const lesson = this.getLessonId();

		delete otherProps.outlineId;

		return (
			<Content.Pager
				{...otherProps}
				className={cx('mobile-course-items')}
				course={course}
				lesson={lesson}
				selection={selection}
				requiredOnly={Overview.isFilteredToRequired()}
				overrides={overrides}
				returnPath={this.getReturnPath()}
				aside={false}
				header={false}
			/>
		);
	}
}
