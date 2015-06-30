import React from 'react';

export default React.createClass({
	displayName: 'ProfessionalPositionWidget',

	statics: {
		handles (item) {
			return item.MimeType && (/profile\.professionalposition$/i).test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;
		return (
			<div className="professional-position">
				<h2 className="professional-position-company">{item.companyName}</h2>
				<p><span className="title">{item.title}</span>, <span className="years">{item.startYear} to {item.endYear}</span></p>
				<div className="professional-position-description">{item.description}</div>
			</div>
		);
	}
});
