import React from 'react';
import {BLANK_IMAGE} from 'common/constants/DataURIs';

export default React.createClass({
	displayName: 'CourseBanner',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	render () {
		let {course} = this.props;
		if (!course) {
			console.warn('course prop is required. skipping render.');
			return null;
		}
		let p = course.getPresentationProperties();
		return (
			<div className="course-banner">
				<img src={p.background || p.icon || BLANK_IMAGE} />
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
			</div>
		);
	}
});
