import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import CatalogAccessor from '../mixins/CatalogAccessor';

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
			busy: false
		};
	},


	componentWillMount () {
		this.registerStoreEventHandlers({
			[GIFT_CODE_REDEEMED]: () => this.navigate('/enrollment/success/', {replace: true}),
			[INVALID_GIFT_CODE]: (e) => this.setState({busy: false, errors: {accessKey: {message: e.reason }}})
		});

		this.setState({
			accessKey: this.props.code || ''
		});
		this.resolvePurchasable();
	},


	componentWillReceiveProps (nextProps) {
		this.resolvePurchasable(nextProps);
	},


	getContext () {
		const {props: {entryId}, state: {purchasable}} = this;
		const {title} = purchasable || {};

		if (!purchasable) {
			return [
				{label: 'Catalog', href: this.makeHref('/')}
			];
		}

		return [
			{
				label: title,
				href: this.makeHref(`/item/${entryId}/`)
			},
			{
				label: 'Redeem Gift',
				href: this.makeHref(`/redeem/${entryId}/`)
			}
		];
	},


	updateKey () {
		const {refs: {key: {value} = {}}} = this;
		this.setState({accessKey: value});
	},


	resolvePurchasable (props = this.props) {
		let entry = this.getCatalogEntry(decodeFromURI(props.entryId));

		if (!entry) {
			console.error('Unable to find requested catalog entry, redirect to route root.');
			this.navigate('/', {replace: true});
			return;
		}

		let options = entry.getEnrollmentOptions();
		let option = options.getEnrollmentOptionForPurchase();

		const purchasable = option && option.getPurchasableForGifting();
		this.setState({purchasable});
	},


	handleSubmit (event) {
		const {purchasable} = this.state;
		event.preventDefault();
		this.setState({ busy: true });

		redeemGift(
			purchasable,
			decodeFromURI(this.props.entryId),
			this.state.accessKey);
	},


	render () {
		let {busy, error, errors, accessKey = ''} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (busy) {
			return <Loading />;
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
