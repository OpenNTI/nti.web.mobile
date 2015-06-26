import React from 'react';
import Card from './Card';
import renderItemsMixin from './widgets/Mixin';
import Loading from 'common/components/TinyLoader';

export default React.createClass({
	displayName: 'Activity',
	mixins: [renderItemsMixin],

	getInitialState: function() {
		return {
		};
	},

	componentWillReceiveProps: function(nextProps) {
		if(nextProps.user) {
			nextProps.user.getActivity().then(
				activity => this.setState({
					activity
				}),
				reason => this.setState({
					error: reason
				})
			);
		}
	},

	render () {

		if (this.state.error) {
			return <div>Error</div>;
		}

		let activity = this.state.activity;

		if (!activity) {
			return <Loading />;
		}

		return (
			<ul className="profile-cards">
				<Card className="activity" title="Activity">
					{this.renderItems(activity)}
				</Card>
			</ul>
		);
	}
});
