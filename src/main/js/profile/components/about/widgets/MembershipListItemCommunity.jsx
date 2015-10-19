import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import Link from '../../ProfileLink';

export default React.createClass({
	displayName: 'MembershipListItemCommunity',

	statics: {
		handles (item) {
			return item.isCommunity;
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;

		return (
			<li className="membership community">
				<Link entity={item}>
					<Avatar entity={item}/>
					<DisplayName entity={item}/>
				</Link>
			</li>
		);
	}
});
