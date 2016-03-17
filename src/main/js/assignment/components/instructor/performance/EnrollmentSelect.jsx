import React from 'react';
import SelectBox from 'common/components/SelectBox';

const OPTIONS = [
	{ label: 'Open Students', value: 'Open'},
	{ label: 'Enrolled Students', value: 'ForCredit'}
];

export default function EnrollmentSelect ({value = 'Open', onChange}) {
	return (
		<SelectBox options={OPTIONS} onChange={onChange} value={value} />
	);
}

EnrollmentSelect.propTypes = {
	value: React.PropTypes.any,
	onChange: React.PropTypes.func.isRequired
};
