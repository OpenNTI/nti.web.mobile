import React from 'react';

import {Locations, Location} from 'react-router-component';

import Collection from './Collection';
import EntryDetail from './EntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';


import ContextReciever from 'common/mixins/ContextReciever';
import ContextSender from 'common/mixins/ContextSender';
import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';
import NavigationBar from 'navigation/components/Bar';

import Enrollment from 'enrollment/components/View';


let CatalogBody = React.createClass({
	mixins: [BasePathAware, ContextSender],


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
		let {catalog} = this.props;
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


export default React.createClass({
	displayName: 'CatalogView',
	mixins: [CatalogAccessor, ContextReciever],


	render () {
        let catalog = this.getCatalog();
		let {pageSource, currentPage, navigatableContext} = this.state || {};

		let nav = {
			pageSource, currentPage,
			navigatableContext: navigatableContext || this
		};

		return (
			<div>
				<NavigationBar title="Catalog" {...nav} />
				{!catalog? <Loading/> : <CatalogBody catalog={catalog}/>}
			</div>
        );
	},
});
