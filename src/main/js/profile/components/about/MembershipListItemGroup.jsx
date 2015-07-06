import React from 'react';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'MembershipListItemCommunity',

	statics: {
		handles (item) {
			return item.isGroup;
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {item} = this.props;

		return (
			<li className="memembership group">
				<Avatar entity={item}/>
				<DisplayName entity={item}/>
			</li>
		);
	}
});
