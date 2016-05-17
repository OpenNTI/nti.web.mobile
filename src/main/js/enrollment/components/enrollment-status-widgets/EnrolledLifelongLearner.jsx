import React from 'react';

export default function EnrolledLifelongLearner () {
	return (
		<div className="enrollment-status-lifelong">
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
