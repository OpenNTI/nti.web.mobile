import PropTypes from 'prop-types';
import React from 'react';
import {DateTime} from '@nti/web-commons';

export default class extends React.Component {
	static displayName = 'AssignmentFooter';

	static propTypes = {
		assignment: PropTypes.object.isRequired,
		history: PropTypes.object,
		dateFormat: PropTypes.string
	};

	static defaultProps = {
		dateFormat: 'dddd, MMMM D'
	};

	render () {

		const {assignment, history, dateFormat} = this.props;
		const completed = !!history;
		const graded = !!(history && history.getGradeValue());

		return (
			<div className="footer">
				{completed
					? graded ? 'Graded' : 'Completed'
					: (
						<div>
							{'Due '}
							<DateTime
								date={assignment.getDueDate()}
								format={dateFormat}
							/>
						</div>
					)}
			</div>
		);
	}
}
