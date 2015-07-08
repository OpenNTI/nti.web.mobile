import React from 'react';
import PromiseButton from 'common/components/PromiseButton';
import RedirectToProfile from '../../mixins/RedirectToProfile';

export default React.createClass({
	displayName: 'CommunityLeaveButton',

	mixins: [RedirectToProfile],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let promise = entity.leave.bind(entity);

		return (
			<div>
				<PromiseButton text="Leave Community" promise={promise} then={this.redirectToProfile} />
			</div>
		);
	}
});
