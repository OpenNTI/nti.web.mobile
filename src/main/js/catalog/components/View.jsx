import React from 'react';

import Collection from './Collection';
import EntryDetail from './EntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';

import Page from 'common/components/Page';

import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';

import {Locations, Location} from 'react-router-component';

import Enrollment from 'enrollment/components/View';

export default React.createClass({
	displayName: 'CatalogView',
	mixins: [CatalogAccessor, BasePathAware],


	shouldComponentUpdate (_, newState) {
		let newCatalog = (this.state || {}).catalog !== (newState || {}).catalog;

		let {router} = this.refs;
		let r = router || {refs: {}};
		let {enrollment} = r.refs;

		if (newCatalog && enrollment && enrollment.isMounted()) {
			return false;
		}

		return true;
	},


	render () {
        let catalog = this.getCatalog();

		return (
			<Page title="Catalog" contextProvider={this._getContext}>

				{!catalog? <Loading/> : this.renderPageContent(catalog)}

			</Page>
        );
	},


	renderPageContent (catalog) {
		return (
			<Locations contextual ref="router">
				<Location
					ref="enrollment"
					path="/item/:entryId/enrollment(/*)"
					handler={Enrollment}
				/>
				<Location
					path="/item/:entryId(/*)"
					handler={EntryDetail}
				/>
				<Location
					path="*"
					handler={Collection}
					list={catalog}
					section="catalog"
				/>
		</Locations>
		);
	},


	_getContext () {
		let path = this.getBasePath();
		return Promise.resolve([{
			label: 'Library',
			href: path + 'library/'
		},{
			label: 'Catalog',
			href: path + 'catalog/'
		}]);
	}
});
