import React from 'react';

import PostItem from './list-items/PostItem';

export default function PostHeadline(props) {
	return <PostItem {...props} detailLink={false} />;
}
