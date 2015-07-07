import React from 'react';
import Avatar from 'common/components/Avatar';

export default React.createClass({
	displayName: 'Community:Head',

	propTypes: {
		entity: React.PropTypes.object,

		narrow: React.PropTypes.object
	},

	render () {
		let {entity} = this.props;

		return (
			<div className="community head">
				<div className="avatar-wrapper">
					<Avatar entity={entity}/>
				</div>
			</div>
		);
	}
});
