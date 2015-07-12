import React from 'react';
import ModeledContentPanel from 'modeled-content/components/Panel';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

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
				<div className="educational-experience-school"><ModeledContentPanel body={ensureArray(item.school)} /></div>
				<p className="educational-experience-degree">{item.degree}, {years}</p>
			</div>
		);
	}
});
