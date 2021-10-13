import './TotalPointsLabel.scss';
import PropTypes from 'prop-types';

TotalPointsLabel.propTypes = {
	assignment: PropTypes.object,
};

export default function TotalPointsLabel({ assignment }) {
	const points = assignment && assignment.totalPoints;

	return (
		!isNaN(points) &&
		points > 0 && (
			<span>
				{' '}
				<strong className="assignment-total-points">
					{points} pts
				</strong>
			</span>
		)
	);
}
