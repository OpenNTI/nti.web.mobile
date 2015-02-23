import React from 'react';

export default React.createClass({
	displayName: 'ForumsHeading',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	render () {

		let {course} = this.props;
		let courseProps = course.getPresentationProperties();
		let title = courseProps.title;

		return (
			<div className="forums-heading">{title}</div>
		);
	}
});
