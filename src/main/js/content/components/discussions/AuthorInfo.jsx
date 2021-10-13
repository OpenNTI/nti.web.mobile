import './AuthorInfo.scss';
import PropTypes from 'prop-types';

import { DateTime, LuckyCharms } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';
import RepliedTo from 'internal/common/components/RepliedTo';
import SharedWithList from 'internal/common/components/SharedWithList';

const t = scoped('discussion.item', {
	postedBy: 'Posted by %(name)s',
});

export default function AuthorInfo({ item, lite }) {
	const { creator, title } = item;
	const date = item.getCreatedTime();
	const isReply = item.isReply();

	return (
		<div className="author-info">
			<Avatar entity={creator} />
			<div className="meta">
				<LuckyCharms item={item} />
				{isReply ? null : <h1 className="title">{title}</h1>}
				{isReply ? (
					<div className="reply-name-wrapper">
						{lite ? (
							<DisplayName entity={creator} />
						) : (
							<RepliedTo item={item} />
						)}
						<DateTime date={date} relative />
					</div>
				) : (
					<div className="name-wrapper">
						<DisplayName
							entity={creator}
							localeKey={
								lite ? void 0 : data => t('postedBy', data)
							}
						/>
						<DateTime date={date} relative />
						<SharedWithList item={item} />
					</div>
				)}
			</div>
		</div>
	);
}

AuthorInfo.propTypes = {
	item: PropTypes.object.isRequired,
	lite: PropTypes.bool,
};
