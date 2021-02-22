import React from 'react';
import PropTypes from 'prop-types';
import { rawContent } from '@nti/lib-commons';

export default class extends React.Component {
	static displayName = 'ProfessionalPositionWidget';

	static handles(item) {
		return (
			item.MimeType &&
			/profile\.professionalposition$/i.test(item.MimeType)
		);
	}

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		let { item } = this.props;
		let years = [item.startYear, item.endYear].filter(x => x).join(' – ');
		let title = [item.title, years].filter(x => x).join(', ');

		return (
			<div className="professional-position">
				<div className="company" {...rawContent(item.companyName)} />
				<div className="title" {...rawContent(title)} />
				<div
					className="description"
					{...rawContent(item.description)}
				/>
			</div>
		);
	}
}
