import React from 'react';

TotalPointsLabel.propTypes = {
	assignment: React.PropTypes.object
};

export default function TotalPointsLabel ({assignment}) {
	const points = assignment && assignment.totalPoints;

	return (!isNaN(points) && points > 0) && (
		<span>{' '}<strong className="assignment-total-points">{points} pts</strong></span>
	);
}
