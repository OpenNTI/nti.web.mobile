import React from 'react';

import {Locations, Location} from 'react-router-component';

import Collection from './Collection';
import EntryDetail from './EntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';


import ContextReciever from 'common/mixins/ContextReciever';
import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';
import NavigationBar from 'navigation/components/Bar';

import Enrollment from 'enrollment/components/View';



export default React.createClass({
	displayName: 'CatalogView',
	mixins: [CatalogAccessor, BasePathAware, ContextReciever],


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
			<div>
				<NavigationBar title="Catalog" contextProvider={this.getContext} {...this.state} />
				{!catalog? <Loading/> : this.renderPageContent(catalog)}
			</div>
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


	getContext () {
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
