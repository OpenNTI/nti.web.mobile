import React from 'react';

import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';
import {scoped} from 'common/locale';

import SearchSortStore from '../SearchSortStore';

import AssignmentActivityItem from './AssignmentActivityItem';

let t = scoped('LISTS');

export default React.createClass({
	displayName: 'Activity',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		this.setUp();
	},

	componentWillReceiveProps (nextProps) {
		const {assignments} = nextProps;
		if(assignments !== this.props.assignments) {
			this.setUp(nextProps);
		}
	},

	componentWillUnmount () {
		const {history} = SearchSortStore;
		if(history && history.markSeen) {
			history.markSeen();
		}
	},

	setUp (props = this.props) {
		props.assignments.getActivity()
			.then(activity => this.setState({ activity }));
	},

	onStoreChange () {
		this.forceUpdate();
	},

	render () {

		const {activity} = this.state || {};

		if (!activity) {
			return <Loading />;
		}

		if (activity.length === 0) {
			return <Notice>{t('emptyList:activity')}</Notice>;
		}

		return (
			<div>
				<div className="assignments-activity">
					{activity.map((event, index) =>
						<AssignmentActivityItem key={`activity-item-${index}`} event={event} />
					)}
				</div>
			</div>

		);
	}
});
