import React from 'react';
import Student from './student/View';
import Instructor from './instructor/View';
import Loading from 'common/components/Loading';

export default React.createClass({
	displayName: 'Assignments:View',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.getData();
	},

	componentWillReceiveProps (nextProps) {
		this.getData(nextProps);
	},

	getData (props = this.props) {
		this.setState({
			loading: true
		}, () => {
			let {course} = props;
			let p = course.getAssignments();
			p.then(assignments => {
				this.setState({
					assignments,
					loading: false
				});
			});
		});
	},

	render () {
		let {course} = this.props;
		let {loading, assignments} = this.state;

		if(loading) {
			return <Loading />;
		}

		let Comp = course.isAdministrative ? Instructor : Student;
		return <Comp {...this.props} assignments={assignments} />;
	}
});
