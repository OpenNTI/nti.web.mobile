import PropTypes from 'prop-types';

import { SelectBox } from '@nti/web-commons';

const OPTIONS = [
	{ label: 'All Students', value: 'All' },
	{ label: 'Open Students', value: 'Open' },
	{ label: 'Enrolled Students', value: 'ForCredit' },
];

export default function EnrollmentSelect({ value = 'Open', onChange }) {
	return <SelectBox options={OPTIONS} onChange={onChange} value={value} />;
}

EnrollmentSelect.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
};
