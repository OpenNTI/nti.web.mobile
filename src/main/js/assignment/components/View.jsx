import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Student from './student/View';
import Instructor from './instructor/View';
import {Loading, Mixins} from 'nti-web-commons';
import ContextContributor from 'common/mixins/ContextContributor';

import AssignmentsHolder from '../mixins/AssignmentCollectionHolder';

export default createReactClass({
	displayName: 'Assignments:View',

	mixins: [AssignmentsHolder, Mixins.NavigatableMixin, ContextContributor],

	propTypes: {
		course: PropTypes.object.isRequired
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
		if (this.props.course !== nextProps.course) {
			this.getData(nextProps);
		}
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
			return ( <Loading.Mask /> );
		}

		let Comp = course.isAdministrative && course.GradeBook ? Instructor : Student;
		return ( <Comp {...this.props} assignments={assignments} /> );
	}
});
