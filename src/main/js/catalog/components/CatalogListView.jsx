import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Catalog from 'nti-web-catalog';

import Page from 'common/components/Page';
import ContextSender from 'common/mixins/ContextSender';

function getRouteFor (obj) {
	//Check if the object is a catalog entry and handle it appropriately
}

export default createReactClass({
	displayName: 'CatalogListView',

	mixins: [ContextSender],

	contextTypes: {
		router: PropTypes.object
	},


	childContextTypes: {
		router: PropTypes.object
	},

	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile/catalog/',
				getRouteFor
			}
		};
	},


	availableSections: [
		{label: 'Courses', href: '/'},
		{label: 'History', href: '/purchased/'},
		{label: 'Redeem', href: '/redeem/'}
	],


	render () {
		return (
			<Page title="Catalog" availableSections={this.availableSections}>
				<Catalog />
			</Page>
		);
	}
});
