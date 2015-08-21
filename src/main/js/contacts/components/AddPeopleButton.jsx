import React from 'react';

export default React.createClass({
	displayName: 'AddPeopleButton',

	propTypes: {
		onClick: React.PropTypes.func.isRequired
	},

	render () {
		return (
			<div className="add-people" onClick={this.props.onClick}>
				<i className="icon-add-user" />
				<span>Add People</span>
			</div>
		);
	}
});
