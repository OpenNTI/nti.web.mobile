import React from 'react';

import {Locations, Location} from 'react-router-component';

import CatalogListView from './CatalogListView';
import EntryDetail from './EntryDetail';

import CatalogAccessor from '../mixins/CatalogAccessor';

import ContextMixin from 'common/mixins/ContextContributor';
import BasePathAware from 'common/mixins/BasePath';

import {Loading} from 'nti-web-commons';
import Page from 'common/components/Page';

import Enrollment from 'enrollment/components/View';
import PaymentComplete from 'enrollment/five-minute/components/PaymentComplete';
import Enroll from 'enrollment/components/Enroll';
import GiftPurchaseView from 'enrollment/store-enrollment/components/GiftPurchaseView';
import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import GiftRedeem from './GiftRedeem';
import AcceptInvitation from 'invitations/components/Accept';

const CatalogBody = React.createClass({
	displayName: 'CatalogBody',
	mixins: [BasePathAware, ContextMixin],


	propTypes: {
		catalog: React.PropTypes.object
	},


	shouldComponentUpdate (_, newState) {
		let newCatalog = (this.state || {}).catalog !== (newState || {}).catalog;

		let {enrollment} = this;

		if (newCatalog && enrollment && enrollment.isMounted()) {
			return false;
		}

		return true;
	},


	render () {
		let {catalog} = this.props;
		return (
			<Locations contextual ref={x => this.router = x}>
				<Location
					ref={x => this.paymentcomplete = x}
					path="/enroll/:enrollmentType/paymentcomplete/"
					handler={PaymentComplete}
				/>
				<Location
					ref={x => this.enroll = x}
					path="/enroll/:enrollmentType/:entryId(/*)"
					handler={Enrollment}
				/>
				<Location
					ref={x => this.gift = x}
					path="/gift/purchase/:entryId(/*)"
					handler={GiftPurchaseView}
				/>
				<Location
					ref={x => this.enrollment = x}
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
					path="/code/(:code)(/*)"
					handler={AcceptInvitation}
				/>
				<Location
					path="/enrollment/success/"
					handler={EnrollmentSuccess}
				/>
				<Location
					path="*"
					handler={CatalogListView}
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
