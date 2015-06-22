import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import CatalogAccessor from '../mixins/CatalogAccessor';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import {scoped} from 'common/locale';

import Store from '../Store';
import {GIFT_CODE_REDEEMED, INVALID_GIFT_CODE} from '../Constants';
import {RENDERED_FORM_EVENT_HANDLERS as Events} from 'common/forms/Constants';
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
		this.setState({
			accessKey: this.props.code || ''
		});
	},


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
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


	onStoreChange (event) {
		switch( (event || {}).type ) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case INVALID_GIFT_CODE:
				this.setState({
					busy: false,
					errors: {
						accessKey: {
							message: event.reason
						}
					}
				});
			break;
			case GIFT_CODE_REDEEMED:
				this.setState({
					busy: false,
					success: true,
					errors: {}
				});
			break;
		}
	},

	getPurchasable () {
		let entry = this.getCatalogEntry(decodeFromURI(this.props.entryId));
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

	[Events.ON_CHANGE] (event) {
		this.updateFieldValueState(event);
	},

	render () {
		let {busy, success, errors, accessKey=''} = this.state;

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
