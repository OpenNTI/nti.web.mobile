import React from 'react';

import DateTime from 'common/components/DateTime';

export default function EnrolledLifelongLearner (props) {
	const {catalogEntry} = props;

	return (
		<div className="enrollment-status-lifelong">
			<div>
				<div className="heading">You're Enrolled as a Lifelong Learner</div>
				<div className="content">
					Class begins <DateTime date={catalogEntry.getStartDate()} /> and will be conducted fully online.
				</div>
			</div>
			<div className="status">
				<span className="registered">You are registered</span>
			</div>
		</div>
	);
}

EnrolledLifelongLearner.propTypes = {
	catalogEntry: React.PropTypes.object.isRequired
};

EnrolledLifelongLearner.displayName = 'EnrolledLifelongLearner';
