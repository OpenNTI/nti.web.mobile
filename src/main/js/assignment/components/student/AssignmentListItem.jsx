import './AssignmentListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { decorate } from '@nti/lib-commons';
import { encodeForURI } from '@nti/lib-ntiids';
import { HOC } from '@nti/web-commons';
import AssignmentStatusLabel from 'internal/assessment/components/AssignmentStatusLabel';

import Assignments from '../bindings/Assignments';
import TotalPointsLabel from '../shared/TotalPointsLabel';

class AssignmentListItem extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired,
		assignments: PropTypes.object.isRequired,
	};

	static getItem = ({ assessment: item } = this.props) => item;

	state = {};

	componentDidMount() {
		this.onItemChanged();
	}

	onItemChanged = async () => {
		const { assignment, assignments } = this.props;

		const history = await assignments.getHistoryItem(assignment.getID());

		this.setState({ history });
	};

	render() {
		const {
			props: { assignment },
			state: { history },
		} = this;
		const complete = assignment?.CompletedItem;
		const failed = complete?.Success === false;

		return (
			<a
				className={cx('assignment-item', { complete, failed })}
				href={`./${encodeForURI(assignment.getID())}/`}
			>
				<div>
					{assignment.title}
					<TotalPointsLabel assignment={assignment} />
					<AssignmentStatusLabel
						assignment={assignment}
						historyItem={history}
						showTimeWithDate
					/>
				</div>
			</a>
		);
	}
}

export default decorate(AssignmentListItem, [
	Assignments.connect,
	HOC.ItemChanges.compose,
]);
