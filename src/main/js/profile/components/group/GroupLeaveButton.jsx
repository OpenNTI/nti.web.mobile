import React from 'react';
import Button from 'common/forms/components/Button';
import {leaveGroup} from '../../Api';
import RedirectToProfile from '../../mixins/RedirectToProfile';

export default React.createClass({
	displayName: 'GroupLeaveButton',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	updateStatus(props=this.props) {
		let {entity} = props;
		this.setState({
			isMember: entity.getLink('my_membership')
		});
	},

	handleClick() {
		leaveGroup(this.props.entity).then(() => {
			this.redirectToProfile();
		});
	},

	render () {
		let isMember = !!this.props.entity.getLink('my_membership');
		if (!isMember) {
			return null;
		}
		return (
			<Button className="group-leave-button" onClick={this.handleClick}>Leave Group</Button>
		);
	}
});
