import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {PromiseButton} from 'nti-web-commons';
import RedirectToProfile from '../../mixins/RedirectToProfile';

export default createReactClass({
	displayName: 'CommunityLeaveButton',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: PropTypes.object.isRequired
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
