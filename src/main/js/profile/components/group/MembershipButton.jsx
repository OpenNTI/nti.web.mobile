import { join } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Mixins } from '@nti/web-commons';
import { Button } from '@nti/web-core';
import { profileHref } from 'internal/profile/mixins/ProfileLink';

export default createReactClass({
	displayName: 'GroupLeaveButton',

	mixins: [Mixins.BasePath, Mixins.NavigatableMixin],

	propTypes: {
		entity: PropTypes.object.isRequired,
	},

	updateStatus(props = this.props) {
		let { entity } = props;
		this.setState({
			isMember: entity.isMember,
		});
	},

	handleClick() {
		this.props.entity
			.leave()
			.then(() => this.redirectToProfile('memberships/'));
	},

	redirectToProfile() {
		let link = profileHref();
		let memberships = join(this.getBasePath(), link, 'memberships/');
		this.navigateRoot(memberships);
	},

	render() {
		let { isMember } = this.props.entity;
		if (!isMember) {
			return null;
		}
		//Leave is grey, Join is blue...
		return (
			<Button className="group-leave-button" onClick={this.handleClick}>
				Leave Group
			</Button>
		);
	},
});
