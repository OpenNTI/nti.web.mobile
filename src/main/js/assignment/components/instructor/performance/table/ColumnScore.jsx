import React from 'react';

import GradeBox from '../../GradeBox';

export default class extends React.Component {
    static displayName = 'performance:ColumnScore';

    static label() {
        return 'Score';
    }

    static className = 'col-score';
    static sort = 'grade';

    static propTypes = {
		item: React.PropTypes.object.isRequired,
		userId: React.PropTypes.string.isRequired
	};

    render() {

		const {item, userId} = this.props;
		const {grade, assignmentId} = item;

		return (
			<div>
				<GradeBox assignmentId={assignmentId} userId={userId} grade={grade} />
			</div>
		);
	}
}
