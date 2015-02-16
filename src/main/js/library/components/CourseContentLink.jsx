import React from 'react';
import Mixin from './CourseContentLinkMixin';

export default React.createClass({
	displayName: 'CourseContentLink',
	mixins: [Mixin],

	propTypes: {
		courseId: React.PropTypes.string.isRequired
	},

	render: function() {

		var href = this.courseHref(this.props.courseId);

		return (
			<a {...this.props} href={href}>{this.props.children}</a>
		);
	}

});
