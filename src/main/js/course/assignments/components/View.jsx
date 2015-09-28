import React from 'react';
import Student from './student/View';
import Instructor from './instructor/View';
import Loading from 'common/components/Loading';
import Navigatable from 'common/mixins/NavigatableMixin';
import ContextSender from 'common/mixins/ContextSender';

export default React.createClass({
	displayName: 'Assignments:View',

	mixins: [Navigatable, ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentDidMount () {
		this.getData();
	},

	componentWillReceiveProps (nextProps) {
		this.getData(nextProps);
	},

	getContext () {
		let href = this.makeHref('/assignments/');

		return Promise.resolve({
			label: 'Assignments',
			href
		});
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
