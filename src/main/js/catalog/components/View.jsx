import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Locations, Location} from 'react-router-component';
import {Mixins} from '@nti/web-commons';

import Page from 'common/components/Page';
import ContextMixin from 'common/mixins/ContextContributor';
import Enrollment from 'enrollment/components/View';
import PaymentComplete from 'enrollment/five-minute/components/PaymentComplete';
import Enroll from 'enrollment/components/Enroll';
import GiftPurchaseView from 'enrollment/store-enrollment/components/GiftPurchaseView';
import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import AcceptInvitation from 'invitations/components/View';
import Redeem from 'enrollment/components/Redeem';

import ListView from './ListView';
import EntryDetail from './EntryDetail';

export default createReactClass({
	displayName: 'CatalogBody',
	mixins: [Mixins.BasePath, ContextMixin],


	shouldComponentUpdate (_, newState) {
		let newCatalog = (this.state || {}).catalog !== (newState || {}).catalog;

		let {enrollment} = this;

		if (newCatalog && enrollment && enrollment.isMounted()) {
			return false;
		}

		return true;
	},

	attachRouter (x) { this.router = x; },
	attachPaymentComplete (x) { this.paymentcomplete = x; },
	attachEnrollmentEntry (x) { this.enroll = x; },
	attachEnrollment (x) { this.enrollment = x; },
	attachGift (x) { this.gift = x; },


	render () {
		return (
			<Locations contextual ref={this.attachRouter} component={renderCatalogPage}>
				<Location
					ref={this.attachPaymentComplete}
					path="/enroll/:enrollmentType/paymentcomplete/"
					handler={PaymentComplete}
				/>
				<Location
					ref={this.attachEnrollment}
					path="/enroll/:enrollmentType/:entryId(/*)"
					handler={Enrollment}
				/>
				<Location
					ref={this.attachGift}
					path="/gift/purchase/:entryId(/*)"
					handler={GiftPurchaseView}
				/>
				<Location
					path="/item/:entryId/redeem"
					handler={Redeem}
				/>
				<Location
					ref={this.attachEnrollment}
					path="/item/:entryId/enrollment(/*)"
					handler={Enroll}
				/>
				<Location
					path="/item/:entryId(/*)"
					handler={EntryDetail}
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
					path="/:category/item/:entryId(/*)"
					handler={EntryDetail}
				/>
				<Location
					path="*"
					handler={ListView}
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

renderCatalogPage.propTypes = {
	children: PropTypes.any
};
function renderCatalogPage ({children}) {
	const child = React.Children.only(children);

	if (child.type === ListView) {
		return child;
	}

	return (
		<Page title="Catalog">
			{child}
		</Page>
	);
}
