import React from 'react';
import MembershipList from './MembershipList';

export default React.createClass({
	displayName: 'Memberships',

	propTypes: {
		memberships: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			list: null
		};
	},

	componentDidMount: function() {
		this.load();
	},

	load () {
		let {memberships} = this.props;
		memberships.nextBatch().then(list => this.setState({list}));
	},

	render () {

		let unfiltered = this.state.list;

		if (!unfiltered) {
			return null;
		}

		return (
			<div className="profile-memberships">
				<MembershipList list={unfiltered} title="Communities"/>
				<MembershipList list={unfiltered} title="Groups" />
			</div>
		);
	}
});
