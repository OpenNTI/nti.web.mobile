import React from 'react';
import ModeledContentPanel from 'modeled-content/components/Panel';
import ensureArray from 'nti.lib.interfaces/utils/ensure-array';

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
				<div className="professional-position-company"><ModeledContentPanel body={ensureArray(item.companyName)}/></div>
				<p><span className="title">{item.title}</span>, <span className="years">{item.startYear} {item.endYear && <span>&ndash; {item.endYear}</span>}</span></p>
				<div className="professional-position-description"><ModeledContentPanel body={ensureArray(item.description)} /></div>
			</div>
		);
	}
});
