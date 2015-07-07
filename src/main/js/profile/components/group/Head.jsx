import React from 'react/addons';

import DisplayName from 'common/components/DisplayName';

import Subhead from './Subhead';
import Description from './Description';

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
						<Subhead entity={entity} />
					</div>
					<Description entity={entity} />
				</div>
				{children}
			</div>
		);
	}
});
