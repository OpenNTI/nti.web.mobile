import React from 'react';

import PostItem from './list-items/PostItem';

export default React.createClass({
	displayName: 'PostHeadline',

	render () {
		return (
			<PostItem {...this.props} detailLink={false} />
		);
	}
});
