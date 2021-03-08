import React from 'react';
import PropTypes from 'prop-types';

import { Ellipsed as E } from '@nti/web-commons';
import ProfileLink from 'internal/profile/components/ProfileLink';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';

export default class extends React.Component {
	static displayName = 'CommunityItem';

	static handles(item) {
		return item.isCommunity;
	}

	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	render() {
		const {
			props: { item },
		} = this;
		return (
			<ProfileLink entity={item} className="community-item">
				<Avatar entity={item} />
				<DisplayName tag={E} entity={item} />
			</ProfileLink>
		);
	}
}
