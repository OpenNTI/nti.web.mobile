import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

import ContentView from 'content/components/ViewerLoader';

import Page from '../Page';
import Registry from '../Registry';

function getPageId (location) {
	const {item} = location;

	return item.target || item.getID();
}

function getRootId (pageId, location) {
	const {items = []} = location;

	for (let item of items) {
		const id = item.getID && item.getID();

		if (id) { return id; }
	}

	return pageId;
}

const MIME_TYPES = {
	'application/vnd.nextthought.ltiexternaltoolasset': true,
	'application/vnd.nextthought.relatedworkref': true,
	'application/vnd.nextthought.questionsetref': true,
	'application/vnd.nextthought.naquestionset': true,
	'application/vnd.nextthought.surveyref': true
};

const handles = (obj) => {
	const {location} = obj || {};
	const {item} = location || {};

	if (item && item.isTableOfContentsNode && item.isTopic()) {
		return true;
	}

	return item && MIME_TYPES[item.MimeType] ;
};

export default
@Registry.register(handles)
class CourseItemReading extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		location: PropTypes.object
	}


	render () {
		const {course, location, ...otherProps} = this.props;
		const pageId = getPageId(location);
		const rootId = getRootId(pageId, location);

		debugger;

		return (
			<Page {...this.props}>
				<ContentView
					{...otherProps}
					pageId={pageId}
					rootId={encodeForURI(rootId)}
					contentPackage={course}
					noNavigation
				/>
			</Page>
		);
	}
}
