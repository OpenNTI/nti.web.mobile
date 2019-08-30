import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Community} from '@nti/web-course';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import Styles from './View.css';
import {overrides} from './overrides';

const cx = classnames.bind(Styles);
const t = scoped('nti-web-mobile.course.community.View', {
	label: 'Community'
});

export default class CourseCommunityView extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
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
				baseroute: nav && nav.makeHref('')
			}
		};
	}

	render () {
		const {course} = this.props;

		return (
			<ContextSender getContext={getContext} {...this.props}>
				<div className={cx('mobile-course-community')}>
					<Community course={course} overrides={overrides} />
				</div>
			</ContextSender>
		);
	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")

	return {
		href: context.makeHref(''),
		label: t('label')
	};
}