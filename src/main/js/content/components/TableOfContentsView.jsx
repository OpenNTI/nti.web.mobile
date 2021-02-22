import './TableOfContentsView.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TableOfContents } from '@nti/web-content';
import { Mixins } from '@nti/web-commons';
import { Router, Route } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';

import ContextSender from 'common/mixins/ContextSender';

// const TYPE_TAG_MAP = {
// 	part: 'h1',
// 	chapter: 'h3'
// };

const TableOfContentsWrapper = createReactClass({
	displayName: 'TableOfContentsView',
	mixins: [Mixins.BasePath, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		contentPackage: PropTypes.object.isRequired,
		item: PropTypes.object,
	},

	getRouteFor(obj) {
		if (obj.isContentUnitSearchHit) {
			return this.makeHref(encodeForURI(obj.Containers[0]));
		}
	},

	render() {
		const { contentPackage } = this.props;

		return (
			<Router.RouteForProvider getRouteFor={this.getRouteFor}>
				<TableOfContents.View
					contentPackage={contentPackage}
					banner
					showLastPage
				/>
			</Router.RouteForProvider>
		);
	},
});

export default Router.for([
	Route({
		path: '/',
		component: TableOfContentsWrapper,
	}),
]);
