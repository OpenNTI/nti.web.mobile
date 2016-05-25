import React from 'react';
import {PromiseButton} from 'nti-web-commons';
import RedirectToProfile from '../../mixins/RedirectToProfile';

export default React.createClass({
	displayName: 'CommunityLeaveButton',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},


	onClick (animationEnd) {
		let {entity} = this.props;
		let leaving = entity.leave();


		(animationEnd || leaving)
			.then(() => this.redirectToProfile('memberships/'));

		return leaving;
	},


	render () {
		return (
			<PromiseButton onClick={this.onClick}>
				Leave Community
			</PromiseButton>
		);
	}
});
