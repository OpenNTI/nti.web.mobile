import React from 'react';
import Mixin from '../mixins/CourseContentLinkMixin';

export default React.createClass({
	displayName: 'CourseContentLink',
	mixins: [Mixin],

	propTypes: {
		courseId: React.PropTypes.string.isRequired,
		section: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		let {courseId, section} = this.props;
		let href = this.courseHref(courseId, section);

		return (
			<a {...this.props} href={href}>{this.props.children}</a>
		);
	}

});
