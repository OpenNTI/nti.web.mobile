import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import {Mixins} from 'nti-web-commons';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

import TotalPointsLabel from '../shared/TotalPointsLabel';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'AssignmentItem',
	mixins: [AssignmentsAccessor, Mixins.ItemChanges],

	propTypes: {
		assignment: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	getItem (props = this.props) {
		return props.assignment;
	},


	componentWillMount () {
		this.onItemChanged();
	},


	onItemChanged () {
		const {assignment} = this.props;

		this.getAssignments().getHistoryItem(assignment.getID())
			.then(history => this.setState({history}));
	},


	render () {
		const {props: {assignment}, state: {history}} = this;

		return (
			<a className={cx('assignment-item', { complete: !!history })} href={`./${encodeForURI(assignment.getID())}/`}>
				<div>
					{assignment.title}
					<TotalPointsLabel assignment={assignment}/>
					<AssignmentStatusLabel assignment={assignment} historyItem={history} showTimeWithDate/>
				</div>
			</a>
		);
	}
});
