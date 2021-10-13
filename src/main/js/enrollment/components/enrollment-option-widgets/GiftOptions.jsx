import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins } from '@nti/web-commons';

import GiftableUtils from '../../mixins/GiftableUtils';

import Giftable from './Giftable';
import RedeemButton from './RedeemButton';

export default createReactClass({
	displayName: 'GiftOptions',

	mixins: [Mixins.BasePath, GiftableUtils],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired,
	},

	render() {
		const { catalogEntry } = this.props;
		const entryId = catalogEntry.getID();
		const basePath = this.getBasePath();
		const giftHref =
			basePath + 'catalog/gift/purchase/' + encodeForURI(entryId) + '/';
		const isGiftable = this.hasGiftableEnrollmentOption(catalogEntry);
		const isRedeemable = this.hasRedeemableEnrollmentOption(catalogEntry);

		if (!isGiftable && !isRedeemable) {
			return null;
		}

		return (
			<div className="gift-options-wrapper">
				<ul className="gift-options">
					{isGiftable && (
						<li className="give-gift">
							<Giftable href={giftHref} />
						</li>
					)}
					{isRedeemable && (
						<li className="redeem-gift">
							<RedeemButton catalogId={entryId} />
						</li>
					)}
				</ul>
			</div>
		);
	},
});
