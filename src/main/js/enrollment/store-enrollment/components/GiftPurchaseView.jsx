import React from 'react';
import CatalogAccessor from 'catalog/mixins/CatalogAccessor';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import GiftView from './GiftView';
import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';

export default React.createClass({
	displayName: 'GiftPurchase',

	mixins: [CatalogAccessor],

	propTypes: {
		entryId: React.PropTypes.string.isRequired
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
				ref="router"
				purchasable={purchasable}
				defaultHandler={GiftView}
			/>
		);
	}
});
