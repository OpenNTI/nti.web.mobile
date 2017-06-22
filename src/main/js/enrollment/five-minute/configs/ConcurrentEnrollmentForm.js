//XXX: using the locale function this way will not pickup site string changes after loading...
//FIXME: Move string uages `t()` to the component's render method.
import {scoped} from 'nti-lib-locale';

import {StateSelect, CountrySelect} from 'forms/fields';

import * as Constants from '../Constants';

const t = scoped('ENROLLMENT.forms.fiveminute');

export default Object.freeze([
	{
		fields: [
			{
				ref: Constants.IS_CONCURRENT_FORM,
				type: 'hidden',
				value: true
			},
			{
				ref: 'name',
				required: true,
				// placeholder: t('fullName'),
				label: t('name')
			},
			{
				ref: 'email',
				required: true,
				type: 'email',
				// placeholder: t('email'),
				label: t('email')
			},
			{
				ref: 'telephone_number',
				type: 'tel',
				// placeholder: t('telephone_number'),
				label: t('telephone_number')
			}
		]
	},
	{
		title: 'Address (optional)',
		fields: [
			{
				ref: 'mailing_street_line1',
				label: t('mailing_street_line1')
			},
			{
				ref: 'mailing_street_line2',
				label: t('mailing_street_line2')
			},
			{
				ref: 'city',
				label: t('city')
			},
			StateSelect.withProps({
				label: t('state'),
				required: false
			}),
			CountrySelect.withProps({
				placeholder: t('country'),
				required: false,
				label: t('country')
			}),
			{
				ref: 'postal_code',
				// placeholder: t('postal_code'),
				label: t('postal_code')
			}
		]
	},
	{
		fields: [
			{
				ref: 'contactme',
				type: 'checkbox',
				label: t('contactMe'),
				htmlLabel: true,
				value: 'Y'
			}
		]
	}
]);
