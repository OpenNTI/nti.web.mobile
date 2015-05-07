import React from 'react';

import {Locations, Location} from 'react-router-component';

import Collection from './Collection';
import EntryDetail from './EntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';

import ContextSender from 'common/mixins/ContextSender';
import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';
import Page from 'common/components/Page';

import Enrollment from 'enrollment/components/View';
import Enroll from 'enrollment/components/Enroll';
import GiftPurchaseView from 'enrollment/store-enrollment/components/GiftPurchaseView';
import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import GiftRedeem from './GiftRedeem';


const CatalogBody = React.createClass({
	displayName: 'CatalogBody',
	mixins: [BasePathAware, ContextSender],


	propTypes: {
		catalog: React.PropTypes.object
	},


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
					ref="enroll"
					path="/enroll/:enrollmentType/:entryId(/*)"
					handler={Enrollment}
				/>
				<Location
					ref="gift"
					path="/gift/purchase/:entryId(/*)"
					handler={GiftPurchaseView}
				/>
				<Location
					ref="enrollment"
					path="/item/:entryId/enrollment(/*)"
					handler={Enroll}
				/>
				<Location
					path="/item/:entryId(/*)"
					handler={EntryDetail}
				/>
				<Location
					path="/redeem/:entryId/(:code)"
					handler={GiftRedeem}
				/>
				<Location
					path="/enrollment/success/"
					handler={EnrollmentSuccess}
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
		/*
			This instance of getContext and the instance within the Collection component
			is are interesting cases.  Because the catalog does not literally drill in
			as you navigate, we need to scaffold the path to the user.  This getContext
			returns the base case: the "Library" and "Catalog" nodes, where the Collection
			represents "this" view, so its getContext simply returns an empty array. You
			may be asking why does it (the collection) even have the mixin? The mixin is
			needed to broadcast the navigation context, even if it, itself, does not have
			anything to add.
		 */
		let path = this.getBasePath();
		return Promise.resolve([{
			label: 'Library',
			href: path + 'library/'
		}, {
			label: 'Catalog',
			href: path + 'catalog/'
		}]);
	}
});


export default React.createClass({//eslint-disable-line react/no-multi-comp
	displayName: 'CatalogView',
	mixins: [CatalogAccessor],


	render () {
		let catalog = this.getCatalog();

		return (
			<Page title="Catalog">
				{!catalog ? <Loading/> : <CatalogBody catalog={catalog}/>}
			</Page>
		);
	}
});
