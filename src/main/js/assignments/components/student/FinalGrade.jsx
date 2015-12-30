import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'FinalGrade',

	propTypes: {
		grade: React.PropTypes.shape({
			value: React.PropTypes.string,
			letter: React.PropTypes.string
		})
	},

	render () {

		const {grade} = this.props;

		const classes = cx('final-grade', {
			'unspecified': !grade
		});

		if (!grade) {
			return <span className={classes}>'Not yet entered'</span>;
		}

		return (
			<span className={classes}>
				{grade.value && <span className="grade-value">{grade.value}</span>}
				{grade.letter && <span className="grade-letter">{grade.letter}</span>}
			</span>
		);
	}
});
