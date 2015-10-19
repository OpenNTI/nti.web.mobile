import React from 'react';

export default React.createClass({
	displayName: 'Group:Subhead',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;

		if (!entity || !entity.subhead) {
			return null;
		}

		return (
			<div className="group-subhead">
				<span className="group-subhead-icon" />
				<span className="group-subhead-text">Civil Rights and Civil Liberties P SC 4283-001</span>
			</div>
		);
	}
});
