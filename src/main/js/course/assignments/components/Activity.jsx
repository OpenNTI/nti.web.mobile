import React from 'react';
import Loading from 'common/components/Loading';
import AssignmentActivityItem from './AssignmentActivityItem';
import SearchSortStore from '../SearchSortStore';

export default React.createClass({
	displayName: 'Activity',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentDidMount () {
		this.setUp();
	},

	componentWillReceiveProps (nextProps) {
		let {assignments} = nextProps;
		if(assignments !== this.props.assignments) {
			this.setUp(nextProps);
		}
	},

	componentWillUnmount () {
		let {history} = SearchSortStore;
		if(history && history.markSeen) {
			history.markSeen();
		}
	},

	setUp (props = this.props) {
		let {assignments} = props;
		assignments.getActivity()
			.then(activity => {
				console.debug(activity);
				this.setState({
					activity
				});
			});
	},

	onStoreChange () {
		this.forceUpdate();
	},

	render () {

		let {activity} = this.state;

		if (!activity) {
			return <Loading />;
		}

		return (
			<div>
				<div className="assignments-activity">
					{activity.map((event, index) => <AssignmentActivityItem key={`activity-item-${index}`} event={event} />)}
				</div>
			</div>

		);
	}
});
