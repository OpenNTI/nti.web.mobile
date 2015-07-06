import React from 'react';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';
import Avatar from 'common/components/Avatar';

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
