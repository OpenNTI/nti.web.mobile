import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {User, getAppUser} from '@nti/web-client';
import {Community} from '@nti/web-profiles';
import {Loading} from '@nti/web-commons';

import {Component as ContextSender} from 'common/mixins/ContextSender';
import Page from 'common/components/Page';
import NotFound from 'notfound/components/View';

import Styles from './View.css';
import {overrides} from './overrides';

const cx = classnames.bind(Styles);
const t = scoped('nti-web-mobile.community.View', {
	label: 'Community',
	home: 'Home',
	notFound: 'Community not found.'
});

export default class CommunityView extends React.Component {
	static propTypes = {
		entityId: PropTypes.string.isRequired
	}

	static contextTypes = {
		basePath: PropTypes.string,
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	state = {}

	getChildContext () {
		const {router: nav} = this.context;

		return {
			router: {
				...(nav || {}),
				baseroute: nav &&  nav.makeHref('')
			}
		};
	}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		const {entityId} = this.props;
		const {entityId:prevId} = prevProps;

		if (entityId !== prevId) {
			this.setState({
				community: null,
				error: null
			}, () => this.setup());
		}
	}

	async setup () {
		const {entityId} = this.props;

		try {
			const community = await (entityId === 'me' ? getAppUser() : User.resolve({entityId: decodeURIComponent(entityId)}, true));
			this.setState({community});
		} catch (e) {
			this.setState({error: e, community: null});
		}
	}

	render () {
		const {community, error} = this.state;

		return (
			<Page supportsSearch border>
				<ContextSender getContext={getContext} {...this.props}>
					<div className={cx('mobile-community')}>
						{!community && !error && (<Loading.Spinner.Large />)}
						{!community && error && this.renderError(error)}
						{community && (<Community.View community={community} overrides={overrides} />)}
					</div>
				</ContextSender>
			</Page>
		);
	}


	renderError (error) {
		return (
			<NotFound message={t('notFound')} />
		);
	}
}

async function getContext () {
	const context = this;//this will be called with the ContextContributor's context ("this")

	return [
		{
			href: '/mobile/',
			label: t('home')
		},
		{
			href: context.makeHref(''),
			label: t('label')
		}
	];
}