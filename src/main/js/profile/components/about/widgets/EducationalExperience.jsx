import PropTypes from 'prop-types';
import React from 'react';

import {rawContent} from 'nti-commons';

export default class extends React.Component {
	static displayName = 'ProfessionalPositionWidget';

	static handles (item) {
		return item.MimeType && (/profile\.educationalexperience$/i).test(item.MimeType);
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		let {item} = this.props;
		let years = [item.startYear, item.endYear].filter(x=>x).join(' – ');
		let degree = [item.degree, years].filter(x=>x).join(', ');

		return (
			<div className="educational-experience">
				<div className="school" {...rawContent(item.school)} />
				<div className="degree" {...rawContent(degree)}/>
				<div className="description" {...rawContent(item.description)} />
			</div>
		);
	}
}
