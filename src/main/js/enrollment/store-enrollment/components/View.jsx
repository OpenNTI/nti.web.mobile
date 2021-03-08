import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Error as ErrorComponent, Loading, Mixins } from '@nti/web-commons';

import { priceItem } from '../Actions';
import Store from '../Store';

import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';
import Form from './PaymentForm';

export default createReactClass({
	displayName: 'StoreEnrollmentView',

	mixins: [Mixins.NavigatableMixin, Mixins.BasePath], // needed for getPath() call we're using for the router's key.

	propTypes: {
		courseId: PropTypes.string,
		entryId: PropTypes.string,
		enrollment: PropTypes.shape({
			Purchasable: PropTypes.object,
			getPurchasable: PropTypes.func,
			getPurchasableForGifting: PropTypes.func,
		}).isRequired,
	},

	getInitialState() {
		return {
			loading: true,
		};
	},

	getPurchasable(forGifting = false) {
		let { enrollment } = this.props;

		return forGifting
			? enrollment.getPurchasableForGifting()
			: enrollment.getPurchasable();
	},

	componentDidMount() {
		let purchasable = this.getPurchasable();
		priceItem(purchasable).then(
			pricedItem => this.setState({ loading: false, pricedItem }),
			error => this.setState({ loading: false, error })
		);
	},

	render() {
		if (this.state.error) {
			return (
				<div className="column">
					<ErrorComponent error={this.state.error} />
				</div>
			);
		}

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let isGift = !!Store.getGiftInfo();
		let purchasable = this.getPurchasable(isGift);
		let { courseId, entryId } = this.props;

		return (
			<StoreEnrollmentRoutes
				entryId={entryId}
				purchasable={purchasable}
				courseId={courseId}
				isGift={isGift}
				defaultHandler={Form}
			/>
		);
	},
});
