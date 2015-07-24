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
		let years = [item.startYear, item.endYear].filter(x=>x).join(' – ');
		let title = [item.title, years].filter(x=>x).join(', ');

		return (
			<div className="professional-position">
				<div className="company" dangerouslySetInnerHTML={{__html: item.companyName}}/>
				<div className="title" dangerouslySetInnerHTML={{__html: title}}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.description}} />
			</div>
		);
	}
});
