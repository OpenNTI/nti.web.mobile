import PropTypes from 'prop-types';
import cx from 'classnames';

import ActionsMenu from '../ActionsMenu';

/**
 *
 * @param {object} props
 * @param {import('@nti/lib-interfaces').Models.courses.GradeBookUserSummary} props.item
 * @returns {JSX.Element}
 */
function GradebookColumnActions({ item, ...props }) {
	if (!item.grade) {
		return null;
	}

	return <ActionsMenu {...props} item={item} userId={item.username} />;
}

export default Object.assign(GradebookColumnActions, {
	className: cx(
		'col-actions',
		css`
			text-align: right;
		`
	),
	label: () => '',
	propTypes: {
		item: PropTypes.object.isRequired,
	},
	sort: '',
});
