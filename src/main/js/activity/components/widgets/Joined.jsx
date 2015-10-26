import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'Joined',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {
		let {entity} = this.props;
		return (
			<div className="joined avatar-heading">
				<Avatar entity={entity} />
				<div className="wrap">
					<h1><DisplayName entity={entity} usePronoun/> joined NextThought!</h1>
					<div className="meta"><DateTime date={entity.getCreatedTime()} /></div>
				</div>
			</div>
		);
	}
});
