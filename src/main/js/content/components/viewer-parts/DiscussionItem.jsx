import React from 'react';

import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

import Panel from 'modeled-content/components/Panel';

export default React.createClass({
	displayName: 'content:DiscussionItem',

	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let {item} = this.props;
		let {body, creator, title} = item;
		let date = item.getCreatedTime();

		let preview = (title && [title]) || body;

		return (
			<div className="discussion-item">
				<DisplayName username={creator}/>
				<Panel className="snippet" body={preview} previewMode/>
				<div className="footer">
					<span>0 Comments</span>
					<DateTime date={date} relative/>
				</div>
			</div>
		);
	}
});
