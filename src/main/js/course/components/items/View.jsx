import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI, encodeForURI} from '@nti/lib-ntiids';
import {Content, Overview} from '@nti/web-course';
import {getHistory} from '@nti/web-routing';

import overrides from './overrides';

const TRIM_REGEX = /^.*\/items/;
const NEW_ROUTE_REPLACE_REGEX = /\/items\/.*$/;
const TRIM_LEADING = /^\//;

function getRouteParts (path) {
	try {
		const trimmed = path.replace(TRIM_REGEX, '');
		const parts = trimmed.split('/');

		let selection = [];

		for (let part of parts) {
			if (!part) { continue; }

			selection.push(decodeFromURI(part));
		}

		return {
			selection
		};
	} catch (e) {
		return null;
	}
}

function getURLPart (obj) {
	return encodeForURI(obj.getId ? obj.getId() : obj.getID ? obj.getID() : obj.NTIID);
}

function getOverviewPart (obj, context) {
	if (obj.isTableOfContentsNode) {
		const {relatedWorkRef} = context;

		return relatedWorkRef ?
			`${getOverviewPart(relatedWorkRef)}/${getURLPart(obj)}` :
			getURLPart(obj);
	}

	if (obj.isVideo) {
		const ref = obj.getLinkProperty('ref', 'RefNTIID');
		return ref ? encodeForURI(ref) : getURLPart(obj);
	}

	return getURLPart(obj);
}


export default class CourseItems extends React.Component {
	static getOverviewPart = getOverviewPart

	static propTypes = {
		course: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		const {router: nav} = this.context;

		return {
			router: {
				...(nav || {}),
				baseroute: nav && nav.makeHref(''),
				history: getHistory(),
				getRouteFor: this.getItemRouteFor//this.getRouteFor,
			}
		};
	}

	getItemRouteFor (obj, context) {
		const path = this.getPath();
		const itemRoute = getOverviewPart(obj, context);

		return path
			.replace(NEW_ROUTE_REPLACE_REGEX, `/items/${itemRoute}`)
			.replace(TRIM_LEADING, '');
	}

	getReturnPath () {
		return this.context.router.makeHref('');
	}

	getPath () {
		return this.context.router.getPath();
	}

	getRouteParts () {
		return getRouteParts(this.getPath());
	}

	getLessonId () {
		const {match} = this.context.router.getMatch();

		return match.outlineId ? decodeFromURI(match.outlineId) : null;
	}

	render () {
		const {course} = this.props;
		const {selection} = this.getRouteParts();
		const lesson = this.getLessonId();

		return (
			<Content.Pager
				course={course}
				lesson={lesson}
				selection={selection}
				requiredOnly={Overview.isFilteredToRequired()}
				overrides={overrides}

				returnPath={this.getReturnPath()}

				noAside
				noHeader
			/>
		);
	}
}
