import React from 'react';
import cx from 'classnames';

import {DateTime} from 'nti-web-commons';

export default class extends React.Component {
    static displayName = 'GradebookColumnCompleted';

    static label() {
        return 'Completed';
    }

    static className = 'col-completed';
    static sort = 'dateSubmitted';

    static propTypes = {
		item: React.PropTypes.object.isRequired, // UserGradeBookSummary object
		assignment: React.PropTypes.object.isRequired
	};

    render() {
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
