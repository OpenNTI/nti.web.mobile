import {PropTypes} from 'react';

export default {

	propTypes: {
		course: PropTypes.object.isRequired
	},

	childContextTypes: {
		course: PropTypes.object,
		assignments: PropTypes.object
	},

	getChildContext () {
		const {state: {assignments}, props: {course}} = this;
		return { assignments, course };
	}

};