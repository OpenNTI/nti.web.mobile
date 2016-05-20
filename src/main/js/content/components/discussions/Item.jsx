import React from 'react';

import {encodeForURI} from 'nti-lib-ntiids';

import DisplayName from 'common/components/DisplayName';
import {DateTime} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import {Panel} from 'modeled-content';


const t = scoped('UNITS');

export default function DiscussionsItem ({item}) {
	let {body, creator, title, replyCount = 0} = item;
	let date = item.getCreatedTime();
	let id = encodeForURI(item.getID());

	let preview = item.placeholder ? ['[Deleted]'] : ((title && [title]) || body);

	return (
		<a className="discussion-item" href={id}>
			{!item.placeholder && ( <DisplayName entity={creator}/> )}
			<Panel className="snippet" body={preview} previewMode/>
			<div className="footer">
				<span>{t('comments', {count: replyCount})}</span>
				<DateTime date={date} relative/>
			</div>
		</a>
	);
}

DiscussionsItem.propTypes = {
	item: React.PropTypes.object
};
