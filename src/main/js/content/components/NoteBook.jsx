import React from 'react';
import PropTypes from 'prop-types';
import { getHistory, LinkTo } from '@nti/web-routing';
import { Stream } from '@nti/web-content';
import { Mixins } from '@nti/web-commons';
import createReactClass from 'create-react-class';

import { Component as ContextSender } from 'common/mixins/ContextSender';
import { Component as ContextContributor } from 'common/mixins/ContextContributor';

export class Notebook extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object
	}

	static contextTypes = {
		router: PropTypes.object
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		const { router: nav } = this.context;
		const router = {
			...(nav || {}),
			baseroute: nav && nav.makeHref(''),
			getRouteFor: this.getRouteFor,
			history: getHistory(),
			routeTo: {
				object: (...args) => LinkTo.Object.routeTo(router, ...args)
			}
		};

		return {
			router
		};
	}

	getRouteFor () {}

	makeHref (...args) {
		return this.contextProvider ? this.contextProvider.makeHref(...args) : null;
	}

	render () {
		return (
			<ContextContributor getContext={getContext}>
				<ContextSender/>
				<Stream context={this.props.contentPackage} isMobile />
			</ContextContributor>
		);
	}
}


async function getContext () {
	const context = this; //this will be called with the ContextContributor's context ("this")

	return {
		href: context.makeHref('/n'),
		label: 'Notebook'
	};
}
