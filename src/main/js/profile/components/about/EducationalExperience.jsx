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

		return (
			<div className="educational-experience">
				<div className="school" dangerouslySetInnerHTML={{__html: item.school}} />
				<div className="degree">
					<span dangerouslySetInnerHTML={{__html: item.degree}}/>
					{years && years.length > 0 ? ( <span>, <span className="years">{years}</span></span>) : null}
				</div>
				<div className="description" dangerouslySetInnerHTML={{__html: item.description}} />
			</div>
		);
	}
});
