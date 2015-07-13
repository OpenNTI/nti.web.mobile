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
		let exp = [item.degree, years].filter(x=>x).join(', ');

		return (
			<div className="educational-experience">
				<div className="educational-experience-school" dangerouslySetInnerHTML={{__html: item.school}} />
				<p className="educational-experience-degree">{exp}</p>
			</div>
		);
	}
});
