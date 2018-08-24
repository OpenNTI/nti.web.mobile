import React from 'react';
import PropTypes from 'prop-types';
import { getHistory, LinkTo } from '@nti/web-routing';
import { Stream } from '@nti/web-content';
import { Mixins } from '@nti/web-commons';
import createReactClass from 'create-react-class';

import ContextContributor from 'common/mixins/ContextContributor';

export default createReactClass({
	displayName: 'Content:NoteBook',
	mixins: [ContextContributor, Mixins.NavigatableMixin],

	propTypes: {
		contentPackage: PropTypes.object
	},

	contextTypes: {
		router: PropTypes.object
	},

	childContextTypes: {
		router: PropTypes.object
	},

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
	},

	getRouteFor () {},

	getContext () {
		let href = this.makeHref('n/');
		return Promise.resolve({
			label: 'Note Book',
			href
		});
	},

	render () {
		return <Stream context={this.props.contentPackage} isMobile />;
	}
});
