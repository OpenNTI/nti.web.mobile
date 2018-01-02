import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Catalog from 'nti-web-catalog';

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


	render () {
		return (
			<div className="catalog">
				<div className="header">
					<a href="/mobile/catalog/">Courses</a>
					<a href="/mobile/catalog/purchased">History</a>
					<a href="/mobile/catalog/redeem">Redeem</a>
				</div>
				<Catalog />
			</div>
		);
	}
});
