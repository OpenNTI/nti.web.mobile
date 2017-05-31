import React from 'react';
import {DateTime} from 'nti-web-commons';

export default class extends React.Component {
    static displayName = 'AssignmentFooter';

    static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		history: React.PropTypes.object,
		dateFormat: React.PropTypes.string
	};

    static defaultProps = {
        dateFormat: 'dddd, MMMM D'
    };

    render() {

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
