import React from 'react';

import {DateTime, LuckyCharms}  from 'nti-web-commons';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import RepliedTo from 'common/components/RepliedTo';
import SharedWithList from 'common/components/SharedWithList';

export default function AuthorInfo ({item, lite}) {
	const {creator, title} = item;
	const date = item.getCreatedTime();
	const isReply = item.isReply();

	return (
		<div className="author-info">
			<Avatar entity={creator}/>
			<div className="meta">
				<LuckyCharms item={item}/>
				{isReply ? null : ( <h1 className="title">{title}</h1> )}
				{isReply ? (
					<div className="reply-name-wrapper">
						{lite ? (<DisplayName entity={creator}/>) : (<RepliedTo item={item}/>)}
						<DateTime date={date} relative/>
					</div>
				) : (
					<div className="name-wrapper">
						<DisplayName entity={creator} localeKey={lite ? void 0 : 'DISCUSSIONS.postedBy'}/>
						<DateTime date={date} relative/>
						<SharedWithList item={item}/>
					</div>
				)}
			</div>
		</div>
	);
}

AuthorInfo.propTypes = {
	item: React.PropTypes.object.isRequired,
	lite: React.PropTypes.bool
};
