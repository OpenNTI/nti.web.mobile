import React from 'react';

import {join} from 'path';

import BasePath from 'common/mixins/BasePath';
import Navigable from 'common/mixins/NavigatableMixin';

import Button from 'common/forms/components/Button';

import {makeHref as profileLink} from 'profile/components/ProfileLink';

import {leaveGroup} from '../../Api';



export default React.createClass({
	displayName: 'GroupLeaveButton',

	mixins: [BasePath, Navigable],

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

	redirectToProfile() {
		let link = profileLink();
		let memberships = join(this.getBasePath(), link, 'memberships/');
		this.navigateRoot(memberships);
	},

	render () {
		let isMember = !!this.props.entity.getLink('my_membership');
		if (!isMember) {
			return null;
		}
		//Leave is grey, Join is blue...
		return (
			<Button className="group-leave-button" onClick={this.handleClick}>Leave Group</Button>
		);
	}
});
