import React from 'react';
import Loading from 'common/components/Loading';
import AssignmentGroup from './AssignmentGroup';

export default React.createClass({
	displayName: 'AssignmentsList',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		sort: React.PropTypes.any,
		search: React.PropTypes.string,
		assignments: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.getAssignments();
	},

	componentWillReceiveProps (nextProps) {
		this.getAssignments(nextProps);
	},

	getAssignments (props = this.props) {
		let {assignments, sort, search} = props;
		this.setState({
			loading: true
		}, () => {
			assignments.getAssignmentsBy(sort, search)
				.then(sorted => this.setState({sorted, loading: false}));
		});
	},

	render () {

		let {loading, sorted} = this.state;

		if(loading) {
			return <Loading />;
		}

		return (
			<ul className="assignments-list">
				{sorted.map((group, index) => <li key={index}><AssignmentGroup group={group} course={this.props.course} /></li>)}
			</ul>
		);
	}
});
