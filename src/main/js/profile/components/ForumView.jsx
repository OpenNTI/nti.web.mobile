import React from 'react';
import ForumView from 'forums/components/ForumView';

export default React.createClass({
	displayName: 'ForumView',

	render () {
		return (
			<div className="profile-forums forums-wrapper"><ForumView {...this.props} /></div>
		);
	}
});
