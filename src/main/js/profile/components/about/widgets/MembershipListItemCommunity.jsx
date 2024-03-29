import PropTypes from 'prop-types';
import React from 'react';

import { DisplayName, Avatar } from '@nti/web-commons';

import Link from '../../ProfileLink';

export default class extends React.Component {
	static displayName = 'MembershipListItemCommunity';

	static handles(item) {
		return item.isCommunity;
	}

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		let { item } = this.props;

		return (
			<li className="membership community">
				<Link entity={item}>
					<Avatar entity={item} />
					<DisplayName entity={item} />
				</Link>
			</li>
		);
	}
}
