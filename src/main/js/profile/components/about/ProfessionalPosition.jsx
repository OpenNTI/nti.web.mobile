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
				<div className="professional-position-company" dangerouslySetInnerHTML={{__html: item.companyName}}/>
				<p><span className="title" dangerouslySetInnerHTML={{__html: item.title}}/>, <span className="years">{item.startYear} {item.endYear && <span>&ndash; {item.endYear}</span>}</span></p>
				<div className="professional-position-description" dangerouslySetInnerHTML={{__html: item.description}} />
			</div>
		);
	}
});
