import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import FieldRender from 'common/forms/mixins/RenderFormConfigMixin';
import CatalogAccessor from '../mixins/CatalogAccessor';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import Loading from 'common/components/Loading';

import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import {scoped} from 'common/locale';

import FORM_CONFIG from '../configs/GiftRedeem';

import Store from '../Store';
import {GIFT_CODE_REDEEMED, INVALID_GIFT_CODE} from '../Constants';
import {RENDERED_FORM_EVENT_HANDLERS as Events} from 'common/forms/Constants';
import {redeemGift} from '../Actions';

const t = scoped('ENROLLMENT.GIFT.REDEEM');

export default React.createClass({
	displayName: 'GiftRedeem',
	mixins: [FieldRender, CatalogAccessor],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired,
		entryId: React.PropTypes.string.isRequired,
		code: React.PropTypes.string
	},

	getInitialState () {
		return {
			fieldValues: {},
			errors: {},
			busy: false,
			success: false
		};
	},


	componentWillMount () {
		this.setState({
			fieldValues: {
				accessKey: this.props.code || ''
			}
		});
	},


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
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

		let {entryId} = this.props;

		redeemGift(
			this.getPurchasable(),
			decodeFromURI(entryId),
			this.state.fieldValues.accessKey);
	},

	[Events.ON_CHANGE] (event) {
		this.updateFieldValueState(event);
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		if (this.state.success) {
			let {Title} = this.getPurchasable();
			return (<EnrollmentSuccess courseTitle={Title} />);
		}

		let title = t('formTitle');

		let buttonLabel = t('redeemButton');

		let errors = this.state.errors;

		let disabled = (this.state.fieldValues.accessKey || '').trim().length === 0;

		return (
			<FormPanel title={title} onSubmit={this.handleSubmit}>
				{this.renderFormConfig(FORM_CONFIG, this.state.fieldValues, t)}
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
