import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

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

		let preview = (title && [title]) || body;

		return (
			<a className="discussion-item" href={id}>
				<DisplayName username={creator}/>
				<Panel className="snippet" body={preview} previewMode/>
				<div className="footer">
					<span>{t('comments', {count: replyCount})}</span>
					<DateTime date={date} relative/>
				</div>
			</a>
		);
	}
});
