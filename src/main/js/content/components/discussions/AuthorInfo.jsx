import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';
import RepliedTo from 'common/components/RepliedTo';
import SharedWithList from 'common/components/SharedWithList';

export default React.createClass({
	displayName: 'AuthorInfo',

	propTypes: {
		item: React.PropTypes.object.isRequired,
		lite: React.PropTypes.bool
	},

	render () {
		const {props: {item, lite}} = this;
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
});
