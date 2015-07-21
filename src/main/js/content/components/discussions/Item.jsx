import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Conditional from 'common/components/Conditional';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

import {scoped} from 'common/locale';

import Panel from 'modeled-content/components/Panel';


const t = scoped('UNITS');

export default React.createClass({
	displayName: 'content:discussions:Item',

	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let {item} = this.props;
		let {body, creator, title, replyCount} = item;
		let date = item.getLastModified();
		let id = encodeForURI(item.getID());

		let preview = item.placeholder ? ['[Deleted]'] : ((title && [title]) || body);

		return (
			<a className="discussion-item" href={id}>
				{!item.placeholder && ( <DisplayName entity={creator}/> )}
				<Panel className="snippet" body={preview} previewMode/>
				<Conditional condition={!item.placeholder} className="footer">
					<span>{t('comments', {count: replyCount})}</span>
					<DateTime date={date} relative/>
				</Conditional>
			</a>
		);
	}
});
