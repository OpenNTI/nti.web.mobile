import React from 'react';
import Loader from 'common/components/TinyLoader';
import PromiseButton from 'common/components/PromiseButton';
import {resolve} from 'common/utils/user';

export default React.createClass({
	displayName: 'FollowButton',

	propTypes: {
		username: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			busy: true
		};
	},

	componentDidMount () {
		this.getStatus();
	},

	getStatus () {
		resolve({username: this.props.username})
			.then(user => {
				this.setState({
					user: user,
					busy: false
				});
			});
	},

	render () {

		if (this.state.busy) {
			return <Loader />;
		}

		return (
			<PromiseButton className="follow-button" text="Follow" />
		);
	}
});
