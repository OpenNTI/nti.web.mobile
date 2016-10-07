import React from 'react';

import {Loading} from 'nti-web-commons';

import Panel from 'content/components/discussions/Panel';

export default React.createClass({
	displayName: 'RecentReplies',

	componentWillMount () {
		this.load();
	},

	propTypes: {
		item: React.PropTypes.object.isRequired,
		count: React.PropTypes.number
	},

	load (props = this.props) {

		const {item, count} = props;

		if (!item || !item.getRecentReplies) {
			return;
		}

		this.setState({
			loading: true
		});

		item.getRecentReplies(count)
			.then(replies => this.setState({
				replies,
				loading: false
			}));
	},

	render () {

		const {loading, replies} = this.state;

		if (loading) {
			return <Loading.Ellipse />;
		}

		return (
			<div className="recent-replies">
				{replies.map(r => <Panel item={r} key={r.getID()} lite/>)}
			</div>
		);
	}
});
