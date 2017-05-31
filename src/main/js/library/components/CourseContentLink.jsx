import React from 'react';
import createReactClass from 'create-react-class';
import Mixin from '../mixins/CourseContentLink';

export default createReactClass({
	displayName: 'CourseContentLink',
	mixins: [Mixin],

	propTypes: {
		courseId: React.PropTypes.string.isRequired,
		section: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		let {courseId, section, ...otherProps} = this.props;
		let href = this.courseHref(courseId, section);

		return (
			<a {...otherProps} href={href}>{this.props.children}</a>
		);
	}

});
