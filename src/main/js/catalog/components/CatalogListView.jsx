import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Catalog from 'nti-web-catalog';
import {encodeForURI} from 'nti-lib-ntiids';

import Page from 'common/components/Page';
import ContextSender from 'common/mixins/ContextSender';

const CATALOG_MIME_TYPES = {
	'application/vnd.nextthought.courses.catalogentry': true,
	'application/vnd.nextthought.courses.coursecataloglegacyentry': true,
	'application/vnd.nextthought.courseware.coursecataloglegacyentry': true
};

function getRouteFor (obj) {
	if (CATALOG_MIME_TYPES[obj.MimeType]) {
		return `./item/${encodeForURI(obj.NTIID)}`;
	}
}

export default createReactClass({
	displayName: 'CatalogListView',

	mixins: [ContextSender],

	contextTypes: {
		router: PropTypes.object
	},


	childContextTypes: {
		router: PropTypes.object,
		setRouteViewTitle: PropTypes.func
	},

	getChildContext () {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile/catalog/',
				getRouteFor
			},
			setRouteViewTitle: () => {}
		};
	},


	availableSections: [
		{label: 'Courses', href: '/'},
		{label: 'History', href: '/purchased/'},
		{label: 'Redeem', href: '/redeem/'}
	],


	render () {
		return (
			<Page title="Catalog" availableSections={this.availableSections} supportsSearch border>
				<Catalog />
			</Page>
		);
	}
});
