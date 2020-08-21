import './ColumnCompleted.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime} from '@nti/web-commons';

export default class GradebookColumnCompleted extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
		assignment: PropTypes.object.isRequired
	}

	static label = () => 'Completed'
	static className = 'col-completed'
	static sort = 'dateSubmitted'


	render () {
		const {props: {item: {completed: completedTime}, assignment}} = this;

		const classes = cx({
			'complete': !!completedTime,
			'late': completedTime && completedTime > assignment.getDueDate()
		});
		return (
			<div className={classes}>
				{completedTime && <DateTime date={completedTime} format="MM/DD" />}
			</div>
		);
	}
}
