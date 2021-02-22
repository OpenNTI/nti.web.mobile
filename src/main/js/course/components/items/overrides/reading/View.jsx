import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { encodeForURI } from '@nti/lib-ntiids';
import { scoped } from '@nti/lib-locale';

import ContentView from 'content/components/ViewerLoader';

import Page from '../Page';
import Registry from '../Registry';

import Styles from './View.css';

const cx = classnames.bind(Styles);

const t = scoped('mobile.course.items.overrides.reading.View', {
	page: 'Page %(current)s of %(total)s',
});

function getPageId(location) {
	const { item } = location || {};

	if (!item) {
		return null;
	}

	return item.getID();
}

function getRootId(pageId, location) {
	const { items = [] } = location;

	for (let item of items) {
		const id = item.getID && item.getID();

		if (id) {
			return id;
		}
	}

	return pageId;
}

const MIME_TYPES = {
	'application/vnd.nextthought.ltiexternaltoolasset': true,
	'application/vnd.nextthought.relatedworkref': true,
	'application/vnd.nextthought.questionsetref': true,
	'application/vnd.nextthought.naquestionset': true,
	'application/vnd.nextthought.surveyref': true,
};

const handles = obj => {
	const { location } = obj || {};
	const { item } = location || {};

	if (item && item.isTableOfContentsNode && item.isTopic()) {
		return true;
	}

	return item && MIME_TYPES[item.MimeType];
};

export default class CourseItemReading extends React.Component {
	static propTypes = {
		course: PropTypes.object,
		location: PropTypes.object,
	};

	render() {
		const { course, location, ...otherProps } = this.props;
		const { currentPage, totalPages } = location;
		const pageId = getPageId(location);
		const rootId = getRootId(pageId, location);

		return (
			<Page {...this.props}>
				{this.renderPage(currentPage, totalPages)}
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

	renderPage(current, total) {
		if (!total || total === 1) {
			return null;
		}

		return (
			<div className={cx('page')}>
				{t('page', { current: current + 1, total })}
			</div>
		);
	}
}

Registry.register(handles)(CourseItemReading);
