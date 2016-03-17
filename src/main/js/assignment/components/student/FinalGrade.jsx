import React from 'react';
import cx from 'classnames';

export default function FinalGrade ({grade}) {
	const classes = cx('final-grade', {
		'unspecified': !grade
	});

	if (!grade) {
		return <span className={classes}>Not yet entered</span>;
	}

	return (
		<span className={classes}>
			{grade.value && <span className="grade-value">{grade.value}</span>}
			{grade.letter && <span className="grade-letter">{grade.letter}</span>}
		</span>
	);
}

FinalGrade.propTypes = {
	grade: React.PropTypes.shape({
		value: React.PropTypes.string,
		letter: React.PropTypes.string
	})
};
