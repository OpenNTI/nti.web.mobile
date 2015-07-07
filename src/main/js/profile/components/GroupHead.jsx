import React from 'react/addons';
import DisplayName from 'common/components/DisplayName';
import GroupSubhead from './GroupSubhead';
import GroupDescription from './GroupDescription';

export default React.createClass({
	displayName: 'Group:Head',

	propTypes: {
		children: React.PropTypes.any,

		entity: React.PropTypes.object
	},

	render () {
		let {children, entity} = this.props;

		return (
			<div className="profile-head">
				<div className="group">
					<div className="label">
						<DisplayName entity={entity} />
						<GroupSubhead entity={entity} />
					</div>
					<GroupDescription entity={entity} />
				</div>
				{children}
			</div>
		);
	}
});
