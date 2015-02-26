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
			return;
		}
		let p = course.getPresentationProperties();
		return (
			<div className="course-banner">
				<img style={{backgroundImage: p && p.icon && `url(${p.icon})`}} src={BLANK_IMAGE}/>
				<div className="metadata">
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</div>
			</div>
		);
	}
});
