import React from 'react';

import {priceItem} from '../Actions';
import Store from '../Store';

import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';

import {Loading} from 'nti-web-commons';
import {Error as ErrorComponent} from 'nti-web-commons';
import {Mixins} from 'nti-web-commons';
import Form from './PaymentForm';

export default React.createClass({
	displayName: 'StoreEnrollmentView',

	mixins: [Mixins.NavigatableMixin, Mixins.BasePath], // needed for getPath() call we're using for the router's key.

	propTypes: {
		courseId: React.PropTypes.string,
		entryId: React.PropTypes.string,
		enrollment: React.PropTypes.shape({
			Purchasable: React.PropTypes.object
		}).isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},


	getPurchasable (forGifting = false) {
		let {enrollment} = this.props;

		return forGifting ?
			enrollment.getPurchasableForGifting() :
			enrollment.getPurchasable();
	},

	componentWillMount () {
		let purchasable = this.getPurchasable();
		priceItem(purchasable).then(
			pricedItem => this.setState({ loading: false, pricedItem }),
			error => this.setState({ loading: false, error })
		);
	},

	render () {

		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		let isGift = !!Store.getGiftInfo();
		let purchasable = this.getPurchasable(isGift);
		let {courseId, entryId} = this.props;

		return (
			<StoreEnrollmentRoutes
				entryId={entryId}
				purchasable={purchasable}
				courseId={courseId}
				isGift={isGift}
				defaultHandler={Form}
				/>
		);
	}

});
