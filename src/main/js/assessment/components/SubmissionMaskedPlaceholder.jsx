import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Placeholder from './Placeholder';

const t = scoped('mobile.assessment.components.SubmissionMaskedPlaceholder', {
	header: "You're all set!",
	message: 'Your answers have been submitted.',
});

TimeLockedPlaceholder.propTypes = {
	assignment: PropTypes.object,
};

export default function TimeLockedPlaceholder({ assignment }) {
	const onConfirm = useCallback(e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	}, []);

	return (
		<Placeholder
			assignment={assignment}
			buttonLabel={'Back'}
			message={t('message')}
			onConfirm={onConfirm}
			pageTitle={t('header')}
		/>
	);
}
