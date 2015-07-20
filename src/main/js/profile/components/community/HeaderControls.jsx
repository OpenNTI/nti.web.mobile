import React from 'react';

import LeaveButton from './LeaveButton';
import JoinButton from './JoinButton';

function hasOptions (entity) {
	return entity.hasLink('hide');
}

function canLeave(entity) {
	return entity.hasLink('leave');
}

function canJoin(entity) {
	return entity.hasLink('join');
}

export default React.createClass({
	displayName: 'GroupControls',

	propTypes: {
		entity: React.PropTypes.object
	},

	render () {
		let {entity} = this.props;
		let controls = [
			hasOptions(entity) && this.renderOptions(entity),
			canLeave(entity) && this.renderLeaveButton(entity),
			canJoin(entity) && this.renderJoinButton(entity)
		];

		return React.createElement('ul', {className: 'profile-top-controls-buttons'}, ...controls.filter(x=>x));
	},


	renderOptions () {
		return (
			<li>
				<a className="gear-button"/>
				<ul className="menu"/>
			</li>
		);
	},


	renderLeaveButton (entity) {
		return (
			<li><LeaveButton entity={entity}/></li>
		);
	},


	renderJoinButton (entity) {
		return (
			<li><JoinButton entity={entity}/></li>
		);
	}
});
