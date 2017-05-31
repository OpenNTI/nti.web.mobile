import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import CatalogAccessor from 'catalog/mixins/CatalogAccessor';
import {decodeFromURI} from 'nti-lib-ntiids';
import GiftView from './GiftView';
import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';

export default createReactClass({
	displayName: 'GiftPurchase',

	mixins: [CatalogAccessor],

	propTypes: {
		entryId: PropTypes.string.isRequired
	},

	getPurchasable () {
		let entry = this.getCatalogEntry(decodeFromURI(this.props.entryId));
		let options = entry.getEnrollmentOptions();
		let option = options.getEnrollmentOptionForPurchase();
		return option && option.getPurchasableForGifting();
	},

	render () {
		let purchasable = this.getPurchasable();
		return (
			<StoreEnrollmentRoutes
				{...this.props}
				purchasable={purchasable}
				defaultHandler={GiftView}
			/>
		);
	}
});
