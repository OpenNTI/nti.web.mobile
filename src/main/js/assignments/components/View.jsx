import React from 'react';
import Student from './student/View';
import Instructor from './instructor/View';
import Loading from 'common/components/Loading';
import Navigatable from 'common/mixins/NavigatableMixin';
import ContextContributor from 'common/mixins/ContextContributor';

export default React.createClass({
	displayName: 'Assignments:View',

	mixins: [Navigatable, ContextContributor],

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

		return Promise.resolve({ href, label: 'Assignments' });
	},

	getData (props = this.props) {
		this.setState({ loading: true }, () => {

			props.course.getAssignments().then(assignments => {
				this.setState({ assignments, loading: false });
			});

		});
	},

	render () {
		let {course} = this.props;
		let {loading, assignments} = this.state;

		if(loading) {
			return ( <Loading /> );
		}

		let Comp = course.isAdministrative ? Instructor : Student;
		return ( <Comp {...this.props} assignments={assignments} /> );
	}
});
