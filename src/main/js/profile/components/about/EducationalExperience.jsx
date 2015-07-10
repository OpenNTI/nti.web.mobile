import React from 'react';

export default React.createClass({
	displayName: 'ProfessionalPositionWidget',

	statics: {
		handles (item) {
			return item.MimeType && (/profile\.educationalexperience$/i).test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;
		let years = [item.startYear, item.endYear].filter(x=>x).join('–');
		return (
			<div className="educational-experience">
				<h2 className="educational-experience-school">{item.school}</h2>
				<p className="educational-experience-degree">{item.degree}, {years}</p>
			</div>
		);
	}
});
