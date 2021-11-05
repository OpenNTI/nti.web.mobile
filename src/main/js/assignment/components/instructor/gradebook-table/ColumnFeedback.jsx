import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 *
 * @param {object} props
 * @param {import('@nti/lib-interfaces').Models.courses.GradeBookUserSummary} props.item
 * @returns {JSX.Element}
 */
function GradebookColumnFeedback({ item }) {
	return <div>{item?.feedbackCount > 0 && item.feedbackCount}</div>;
}

export default Object.assign(GradebookColumnFeedback, {
	className: cx(
		'col-feedback',
		css`
			text-align: center;
		`
	),
	label: () => 'Feedback',
	propTypes: {
		item: PropTypes.object.isRequired, // UserGradeBookSummary object
	},
	sort: 'feedbackCount',
});
