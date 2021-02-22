import './GiftRedeem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { decodeFromURI } from '@nti/lib-ntiids';
import { Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';

import EnrollmentSuccess from 'enrollment/components/EnrollmentSuccess';
import FormPanel from 'forms/components/FormPanel';
import FormErrors from 'forms/components/FormErrors';

import { getCatalogEntry } from '../../Api';

const DEFAULT_TEXT = {
	formTitle: 'Redeem this course with an Access Key.',
	redeemButton: 'Redeem',
};

const t = scoped('ENROLLMENT.GIFT.REDEEM', DEFAULT_TEXT);

export default class GiftRedeem extends React.Component {
	static propTypes = {
		entryId: PropTypes.string.isRequired,
		accessKey: PropTypes.string,
	};

	state = {
		accessKey: '',
		errors: {},
		busy: false,
		success: false,
	};

	getPurchasable = async () => {
		const entry = await getCatalogEntry(decodeFromURI(this.props.entryId));

		const { Purchasables } = entry.EnrollmentOptions.Items.StoreEnrollment;
		const pid = Purchasables.DefaultGiftingNTIID;
		return Purchasables.Items.find(item => item.NTIID === pid);
	};

	redeemGift = async (purchasable, courseId, accessKey) => {
		const service = await getService();
		const enrollment = await service.getEnrollment();

		try {
			await enrollment.redeemGift(purchasable, courseId, accessKey);
			this.setState({ busy: false, success: true });
		} catch (error) {
			this.setState({ error, busy: false });
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		this.setState({ busy: true });

		const { entryId } = this.props;

		this.redeemGift(
			this.getPurchasable(),
			decodeFromURI(entryId),
			this.state.accessKey
		);
	};

	onChange = ({ target: { value } }) => {
		this.setState({ accessKey: value });
	};

	render() {
		const { success, busy, accessKey, errors } = this.state;

		if (busy) {
			return <Loading />;
		}

		if (success) {
			let { Title } = this.getPurchasable();
			return <EnrollmentSuccess courseTitle={Title} />;
		}

		const title = t('formTitle');
		const disabled = (accessKey || '').trim().length === 0;

		return (
			<FormPanel
				className="gift-redeem-form"
				title={title}
				onSubmit={this.handleSubmit}
			>
				<div className="gift-input-redeem">
					<input
						type="text"
						name="redeem"
						placeholder="Enter your access code"
						defaultValue={this.props.accessKey}
						value={accessKey}
						onChange={this.handleChange}
					/>
					<button type="submit" disabled={disabled}>
						{t('redeemButton')}
					</button>
				</div>
				<FormErrors errors={errors} />
			</FormPanel>
		);
	}
}
