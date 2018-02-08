import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {decodeFromURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';
import {Error as Err, Loading, Mixins} from 'nti-web-commons';

import FormPanel from 'forms/components/FormPanel';
import FormErrors from 'forms/components/FormErrors';
import ContextSender from 'common/mixins/ContextSender';

import CatalogAccessor from '../mixins/CatalogAccessor';
import {GIFT_CODE_REDEEMED, INVALID_GIFT_CODE} from '../Constants';
import {redeemGift} from '../Actions';

const logger = Logger.get('catalog:components:GiftRedeem');
const t = scoped('enrollment.gift.redeem', {
	'formTitle': 'Redeem this course with an Access Key',
	'accessKey': 'Access Key',
	'redeemButton': 'Redeem'
});

export default createReactClass({
	displayName: 'GiftRedeem',
	mixins: [CatalogAccessor, ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		entryId: PropTypes.string.isRequired,
		code: PropTypes.string
	},

	attachRef (x) { this.key = x; },

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
		const {key: {value} = {}} = this;
		this.setState({accessKey: value});
	},


	resolvePurchasable (props = this.props) {
		let entry = this.getCatalogEntry(decodeFromURI(props.entryId));

		if (!entry) {
			logger.error('Unable to find requested catalog entry, redirect to route root.');
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
			return <Loading.Mask />;
		}

		let title = t('formTitle');

		let buttonLabel = t('redeemButton');

		let disabled = accessKey.trim().length === 0;

		return (
			<FormPanel title={title} onSubmit={this.handleSubmit}>

				<div className="access-code">
					<input name="accessKey" ref={this.attachRef}
						placeholder={t('accessKey')}
						className="required"
						type="text"
						value={accessKey}
						onChange={this.updateKey}
						required/>
				</div>


				<FormErrors errors={errors} />

				<div className="button-row">
					<input type="submit"
						key="submit"
						disabled={disabled}
						id="redeem-submit"
						className="button"
						value={buttonLabel} />
				</div>
			</FormPanel>

		);
	}

});
