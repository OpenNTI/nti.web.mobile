import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Community} from '@nti/web-content';

import {Component as ContextSender} from 'common/mixins/ContextSender';
import {overrides} from 'community/components/overrides';

import Styles from '../../../community/components/View.css';

const cx = classnames.bind(Styles);
const t = scoped('nti-web-mobile.content.community.View', {
	label: 'Community'
});

export default class CourseCommunityView extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired
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
		const {contentPackage} = this.props;

		return (
			<ContextSender getContext={getContext} {...this.props}>
				<div className={cx('mobile-community')}>
					<Community content={contentPackage} overrides={overrides} />
				</div>
			</ContextSender>
		);
	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")

	//TODO: get the label from the course tab name.
	return {
		href: context.makeHref(''),
		label: t('label')
	};
}