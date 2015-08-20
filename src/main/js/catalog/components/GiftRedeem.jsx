import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CatalogAccessor from '../mixins/CatalogAccessor';

import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import {scoped} from 'common/locale';
import Err from 'common/components/Error';

import {GIFT_CODE_REDEEMED, INVALID_GIFT_CODE} from '../Constants';

import {redeemGift} from '../Actions';

const t = scoped('ENROLLMENT.GIFT.REDEEM');

export default React.createClass({
	displayName: 'GiftRedeem',
	mixins: [CatalogAccessor, ContextSender, NavigatableMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired,
		entryId: React.PropTypes.string.isRequired,
		code: React.PropTypes.string
	},

	getInitialState () {
		return {
			accessKey: '',
			errors: {},
			busy: false,
			success: false
		};
	},


	componentWillMount () {
		this.mixinAdditionalHandler(GIFT_CODE_REDEEMED, () => this.setState({busy: false, success: true, errors: {}}));
		this.mixinAdditionalHandler(INVALID_GIFT_CODE, (e) => this.setState({busy: false, errors: {accessKey: {message: e.reason }}}));

		this.setState({
			accessKey: this.props.code || ''
		});
	},


	getContext () {
		let {entryId} = this.props;
		return [
			{
				label: 'Course',
				href: this.makeHref(`/item/${entryId}/`)
			},
			{
				label: 'Redeem Gift',
				href: this.makeHref(`/redeem/${entryId}/`)
			}
		];
	},


	updateKey () {
		let {key} = this.refs;
		let {value} = (key && React.findDOMNode(key)) || {};

		this.setState({accessKey: value});
	},


	getPurchasable () {
		let entry = this.getCatalogEntry(decodeFromURI(this.props.entryId));
		if (!entry) {
			return this.setState({
				error: 'Unable to find requested catalog entry.'
			});
		}
		let options = entry.getEnrollmentOptions();
		let option = options.getEnrollmentOptionForPurchase();

		return option && option.getPurchasableForGifting();
	},


	handleSubmit (event) {
		event.preventDefault();
		this.setState({
			busy: true
		});

		redeemGift(
			this.getPurchasable(),
			decodeFromURI(this.props.entryId),
			this.state.accessKey);
	},


	render () {
		let {busy, success, error, errors, accessKey = ''} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (busy) {
			return <Loading />;
		}

		if (success) {
			let {Title} = this.getPurchasable();
			return (<EnrollmentSuccess courseTitle={Title} />);
		}

		let title = t('formTitle');

		let buttonLabel = t('redeemButton');

		let disabled = accessKey.trim().length === 0;

		return (
			<FormPanel title={title} onSubmit={this.handleSubmit}>
				<fieldset>
					<legend>Redeem</legend>
					<div>
						<input name="accessKey" ref="key"
							placeholder={t('accessKey')}
							className="required"
							type="text"
							value={accessKey}
							onChange={this.updateKey}
							required/>
					</div>
				</fieldset>

				<FormErrors errors={errors} />
				<input type="submit"
					key="submit"
					disabled={disabled}
					id="redeem:submit"
					className="small-12 columns tiny button radius"
					value={buttonLabel} />
			</FormPanel>

		);
	}

});
