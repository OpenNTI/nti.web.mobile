import React from 'react';
import TopicView from 'forums/components/TopicView';

export default React.createClass({
	displayName: 'Topic',

	render () {
		return (
			<div className="profile-topic forums-wrapper"><TopicView {...this.props}/></div>
		);
	}
});
