import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import CatalogView from '@nti/web-catalog';
import { Router, Route } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';
import { scoped } from '@nti/lib-locale';

const t = scoped('library.sections', {
	courses: 'Courses',
});

import Page from 'common/components/Page';
import ContextSender from 'common/mixins/ContextSender';

import { load as loadLibrary } from '../../library/Actions';

const Catalog = Router.for([
	Route({path: '/', component: CatalogView})
]);

const CATALOG_MIME_TYPES = {
	'application/vnd.nextthought.courses.catalogentry': true,
	'application/vnd.nextthought.courses.coursecataloglegacyentry': true,
	'application/vnd.nextthought.courseware.coursecataloglegacyentry': true,
};

function getRouteFor(obj) {
	if (obj.isCourseCatalogEntry && obj.redeemed) {
		return `./item/${encodeForURI(obj.getID())}?redeemed=1`;
	}

	if (CATALOG_MIME_TYPES[obj.MimeType]) {
		return `./item/${encodeForURI(obj.getID())}`;
	}

	if (obj === 'contact-us') {
		return '/mobile/contact-us';
	}
}

export default createReactClass({
	displayName: 'CatalogListView',

	mixins: [ContextSender],

	contextTypes: {
		router: PropTypes.object,
	},

	childContextTypes: {
		router: PropTypes.object,
	},

	getChildContext() {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile/catalog/',
				getRouteFor,
			},
		};
	},

	componentWillUnmount() {
		if (this.dirty) {
			loadLibrary(true);
		}
	},

	markDirty() {
		this.dirty = true;
	},

	availableSections: [
		{ label: t('courses'), href: '/' },
		{ label: 'History', href: '/purchased/' },
		{ label: 'Redeem', href: '/redeem/' },
	],

	render() {
		return (
			<Page
				title="Catalog"
				useCommonTabs
				supportsSearch
				border
			>
				<Catalog markDirty={this.markDirty}/>
			</Page>
		);
	},
});
