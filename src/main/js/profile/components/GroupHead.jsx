import React from 'react/addons';


export default React.createClass({
	displayName: 'Group:Head',

	propTypes: {
		children: React.PropTypes.any,

		entity: React.PropTypes.object
	},

	render () {
		let {children} = this.props;

		return (
			<div className="profile-head">
				<div className="group">
					...
				</div>
				{children}
			</div>
		);
	}
});
