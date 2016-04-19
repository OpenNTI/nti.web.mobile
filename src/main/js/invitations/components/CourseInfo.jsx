import React from 'react';

import CourseContentLink from 'library/mixins/CourseContentLink';

export default React.createClass({
	displayName: 'CourseInfo',

	mixins: [CourseContentLink],

	propTypes: {
		instance: React.PropTypes.object.isRequired
	},

	render () {

		const {instance} = this.props;

		const pp = instance.getPresentationProperties();

		const thumbStyle = {
			backgroundImage: `url(${pp.icon})`
		};

		return (
			<a href={this.courseHref(instance.CourseInstance.getID())}>
				<div className="course-info">
					<div className="thumb" style={thumbStyle}></div>
					<h3 className="title">{pp.title}</h3>
					<div className="course-label">{pp.label}</div>
					<i className="icon-chevron-right" />
				</div>
			</a>
		);
	}
});
