import React from 'react';

export default React.createClass({
	displayName: 'ProfessionalPositionWidget',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.profile\.professionalposition/i,
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
			<div className="professional-position">
				<h2 className="professional-position-company">{item.companyName}</h2>
				<p className="professional-position-title">{item.title}</p>
				<div className="professional-position-description">{item.description}</div>
			</div>
		);
	}
});
