import React from 'react';

export default React.createClass({
	displayName: 'ProfessionalPositionWidget',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.profile\.educationalexperience/i,
		handles (item) {
			return item.MimeType && this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;
		return (
			<div className="educational-experience">
				<h2 className="educational-experience-school">{item.school}</h2>
				<p className="educational-experience-degree">{item.degree}</p>
			</div>
		);
	}
});
