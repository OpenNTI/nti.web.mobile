import PropTypes from 'prop-types';
import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import Link from '../../ProfileLink';

export default class extends React.Component {
	static displayName = 'MembershipListItemCommunity';

	static handles (item) {
		return item.isGroup;
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		let {item} = this.props;

		return (
			<li className="membership group">
				<Link entity={item}>
					<Avatar entity={item}/>
					<DisplayName entity={item}/>
				</Link>
			</li>
		);
	}
}
