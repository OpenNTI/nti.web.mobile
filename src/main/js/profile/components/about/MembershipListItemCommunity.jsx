import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

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
			<li className="memembership community">
				<Avatar entity={item}/>
				<DisplayName entity={item}/>
			</li>
		);
	}
});
