import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {encodeForURI} from '@nti/lib-ntiids';
import {HOC} from '@nti/web-commons';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import Assignments from '../bindings/Assignments';
import TotalPointsLabel from '../shared/TotalPointsLabel';


export default
@Assignments.connect
@HOC.ItemChanges.compose
class AssignmentItem extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired,
		assignments: PropTypes.object.isRequired
	}


	static getItem = ({assessment: item} = this.props) => item


	state = {}


	componentDidMount () {
		this.onItemChanged();
	}


	onItemChanged = async () => {
		const {assignment, assignments} = this.props;

		const history = await assignments.getHistoryItem(assignment.getID());

		this.setState({history});
	}


	render () {
		const {props: {assignment}, state: {history}} = this;
		const failed = assignment && assignment.CompletedItem && !assignment.CompletedItem.Success;

		return (
			<a className={cx('assignment-item', { complete: !!history, failed })} href={`./${encodeForURI(assignment.getID())}/`}>
				<div>
					{assignment.title}
					<TotalPointsLabel assignment={assignment}/>
					<AssignmentStatusLabel assignment={assignment} historyItem={history} showTimeWithDate/>
				</div>
			</a>
		);
	}
}
