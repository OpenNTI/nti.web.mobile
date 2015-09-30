import React from 'react';
import Loading from 'common/components/Loading';
import AssignmentActivityItem from './AssignmentActivityItem';

export default React.createClass({
	displayName: 'Activity',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	componentDidMount () {
		this.setUp();
	},

	componentWillReceiveProps (nextProps) {
		let {course, filterParams} = nextProps;

		if(course !== this.props.course || filterParams !== nextProps.filterParams) {
			this.setUp(nextProps);
		}
	},

	componentWillUnmount () {
		let {stream} = this.state;
		if (stream) {
			stream.removeListener('change', this.onStoreChange);
		}
	},


	componentWillUpdate (_, nextState) {
		let {stream} = this.state;
		let nextStream = nextState.stream;

		if (stream && stream !== nextStream) {
			stream.removeListener('change', this.onStoreChange);
		}

		if (nextStream && nextStream !== stream) {
			nextStream.addListener('change', this.onStoreChange);

			if (!nextStream.loading) {
				console.log('Wut?');
			}
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
