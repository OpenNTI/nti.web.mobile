import React from 'react';

import {encodeForURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

import {scoped} from 'common/locale';

import {Panel} from 'modeled-content';


const t = scoped('UNITS');

export default React.createClass({
	displayName: 'content:discussions:Item',

	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let {item} = this.props;
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
});
