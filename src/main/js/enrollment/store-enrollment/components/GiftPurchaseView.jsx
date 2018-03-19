import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from 'nti-lib-ntiids';
import {getService} from 'nti-web-client';

import GiftView from './GiftView';
import StoreEnrollmentRoutes from './StoreEnrollmentRoutes';

export default class GiftPurchase extends React.Component {

	static propTypes = {
		entryId: PropTypes.string.isRequired
	}

	state = {}


	componentWillMount () {
		this.resolvePurchasable();
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.entryId !== nextProps.entryId) {
			this.resolvePurchasable(nextProps);
		}
	}

	async resolvePurchasable ({entryId} = this.props) {
		const service = await getService();
		const entry = await service.getObject(decodeFromURI(entryId));
		const options = entry.getEnrollmentOptions();
		const option = options.getEnrollmentOptionForPurchase();
		const purchasable = option && option.getPurchasableForGifting();
		this.setState({purchasable});
	}

	render () {
		const {purchasable} = this.state;

		return !purchasable ? null : (
			<StoreEnrollmentRoutes
				{...this.props}
				purchasable={purchasable}
				defaultHandler={GiftView}
			/>
		);
	}
}
