import React from 'react';
import Button from 'common/forms/components/Button';
import RedirectToProfile from '../../mixins/RedirectToProfile';

export default React.createClass({
	displayName: 'CommunityLeaveButton',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	onClick () {
		let {entity} = this.props;
		if (entity && entity.leave) {
			entity.leave().then(() => {
				this.redirectToProfile();
			});
		}
	},

	render () {
		return (
			<Button className="leave-button" onClick={this.onClick}>Leave Community</Button>
		);
	}
});
