import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const units = scoped('common.units');
const t = scoped('course.info', {
	credit: {
		available: 'available'
	},
});

export default function CreditHours ({entry, credit = []}) {
	const keyPrefix = entry + '-credit-';

	return (
		<div className="enroll-for-credit">
			{credit.map((item, i) => {
				const e = item.Enrollment || {};
				return (
					<div className="item" key={keyPrefix + i}>
						{units('credits', { count: item.Hours })} {t('credit.available')}<br />
						<a href={e.url} target="_blank" rel="noopener noreferrer">{e.label}</a>
					</div>
				);
			})}
		</div>
	);
}

CreditHours.propTypes = {
	entry: PropTypes.string.isRequired,
	credit: PropTypes.arrayOf(PropTypes.object).isRequired
};
