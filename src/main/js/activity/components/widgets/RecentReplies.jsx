import React from 'react';

import Loading from 'common/components/TinyLoader';

import Detail from 'content/components/discussions/Detail';

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
			return <Loading />;
		}

		return (
			<div className="recent-replies">
				{replies.map(r => <Detail item={r} lite/>)}
			</div>
		);
	}
});
