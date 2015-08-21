import React from 'react';
import TopicView from 'forums/components/TopicView';

export default React.createClass({
	displayName: 'BlogEntryDetail',

	propTypes: {
		id: React.PropTypes.string.isRequired
	},

	render () {
		return (
			<div className="profile-forums forums-wrapper">
				<TopicView topicId={this.props.id} />
			</div>
		);
	}
});
