import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Placeholder from './Placeholder';

const t = scoped('mobile.assessment.components.TimeLockedPlaceholder', {
	header: 'Currently Unavailable',
	date: 'Your assignment will be available on %(date)s.',
	noDate: 'This assignment has not opened yet. Come back later.'
});

export default class extends React.Component {
	static displayName = 'TimeLockedPlaceholder';

	static propTypes = {
		assignment: PropTypes.object
	};

	onBack = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		global.history.go(-1);
	};

	render () {
		const {props:{assignment}} = this;
		const available = assignment.getAvailableForSubmissionBeginning();
		const date = available && DateTime.format(available, 'dddd, MMMM D [at] h:mmA z');
		const props = {
			assignment,
			message: date ? t('date', {date}) : t('noDate'),
			buttonLabel: 'Back',
			pageTitle: t('header'),
			onConfirm: this.onBack
		};

		return (
			<Placeholder {...props} />
		);
	}
}
