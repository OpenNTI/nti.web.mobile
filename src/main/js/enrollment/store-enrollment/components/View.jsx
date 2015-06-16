import React from 'react';

import Store from '../Store';

import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';

import Loading from 'common/components/Loading';
import ErrorComponent from 'common/components/Error';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Form from './PaymentForm';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'StoreEnrollmentView',

	mixins: [NavigatableMixin, BasePathAware], // needed for getPath() call we're using for the router's key.

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


	getPurchasable (forGifting=false) {
		let {enrollment} = this.props;

		return forGifting ?
			enrollment.getPurchasableForGifting() :
			enrollment.getPurchasable();
	},

	componentWillMount () {
		let purchasable = this.getPurchasable();
		Store.priceItem(purchasable).then(
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
			<div>
				<StoreEnrollmentRoutes
					ref='router'
					entryId={entryId}
					purchasable={purchasable}
					courseId={courseId}
					isGift={isGift}
					defaultHandler={Form}
					/>
			</div>

		);
	}

});
