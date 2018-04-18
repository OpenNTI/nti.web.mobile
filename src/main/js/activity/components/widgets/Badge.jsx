import PropTypes from 'prop-types';
import React from 'react';
import {DateTime} from '@nti/web-commons';

export default class extends React.Component {
	static displayName = 'Badge';

	static handles (item) {
		const {MimeType = ''} = item;
		return /change$/i.test(MimeType) && item.ChangeType === 'BadgeEarned';
	}

	static propTypes = {
		item: PropTypes.any.isRequired
	};

	render () {

		const {item} = this.props;
		const {Item} = item;
		const {image, description, name} = Item;
		const modified = item.getLastModified();

		return (
			<div className="badge-earned">
				<img src={image} />
				<div>You earned the <span className="badge-name">{name}</span> badge.</div>
				<DateTime date={modified} relative/>
				<div>{description}</div>
			</div>
		);
	}
}
