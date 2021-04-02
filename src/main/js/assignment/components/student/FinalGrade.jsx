import './FinalGrade.scss';
import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

export default function FinalGrade({ grade }) {
	const classes = cx('final-grade', {
		unspecified: !grade,
	});

	if (!grade) {
		return null;
	}

	const value = grade.getValue();
	const letter = grade.getLetter();

	return (
		<span className={classes}>
			{value && <span className="grade-value">{value}</span>}
			{letter && <span className="grade-letter">{letter}</span>}
		</span>
	);
}

FinalGrade.propTypes = {
	grade: PropTypes.shape({
		getValue: PropTypes.func,
		getLetter: PropTypes.func,
	}),
};
