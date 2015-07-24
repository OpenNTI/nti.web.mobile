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
		let years = [item.startYear, item.endYear].filter(x=>x).join(' – ');
		let degree = [item.degree, years].filter(x=>x).join(', ');

		return (
			<div className="educational-experience">
				<div className="school" dangerouslySetInnerHTML={{__html: item.school}} />
				<div className="degree" dangerouslySetInnerHTML={{__html: degree}}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.description}} />
			</div>
		);
	}
});
