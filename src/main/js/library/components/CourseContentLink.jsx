import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import Mixin from '../mixins/CourseContentLink';

export default createReactClass({
	displayName: 'CourseContentLink',
	mixins: [Mixin],

	propTypes: {
		courseId: PropTypes.string.isRequired,
		section: PropTypes.string,
		children: PropTypes.any
	},

	render () {
		let {courseId, section, ...otherProps} = this.props;
		let href = this.courseHref(courseId, section);

		return (
			<a {...otherProps} href={href}>{this.props.children}</a>
		);
	}

});
