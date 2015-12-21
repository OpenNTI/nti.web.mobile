import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import ItemChanges from 'common/mixins/ItemChanges';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';

export default React.createClass({
	displayName: 'AssignmentItem',
	mixins: [ItemChanges],

	propTypes: {
		assignment: React.PropTypes.object.isRequired,
		assignments: React.PropTypes.object.isRequired
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
		const {assignments, assignment} = this.props;

		assignments.getHistoryItem(assignment.getID())
			.then(history => this.isMounted() && this.setState({history}));
	},


	render () {
		const {props: {assignment}, state: {history}} = this;

		return (
			<a className={cx('assignment-item', { complete: !!history })} href={`./${encodeForURI(assignment.getID())}/`}>
				{assignment.title}
				<AssignmentStatusLabel assignment={assignment} historyItem={history} showTimeWithDate/>
			</a>
		);
	}
});
