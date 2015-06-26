import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';

import Body from 'modeled-content/components/Panel';

import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';

import NotePanelBehavior from './NotePanelBehavior';

const Panel = React.createClass({
	displayName: 'content:discussions:Panel',
	mixins: [NotePanelBehavior],


	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		let {replying} = this.state;
		let {item} = this.props;
		let {body, creator, placeholder} = item;
		let date = item.getLastModified();

		return (
			<div className="discussion-reply">
				{ placeholder ? (
					<div className="placeholder">This message has been deleted.</div>
				) : (
					<div className="body">
						<LuckyCharms item={item}/>
						<div className="author-info">
							<Avatar username={creator}/>
							<div className="meta">
								<DisplayName username={creator}/>
								<div className="name-wrapper"/>
							</div>
						</div>

						<Body body={body}/>

						{replying ? (
							<div className="footer">
								<ReplyEditor item={item} onCancel={this.hideReplyEditor} onSubmitted={this.hideReplyEditor}/>
							</div>
						) : (
							<div className="footer">
								<DateTime date={date} relative/>
								<ItemActions item={item} isTopLevel onReply={this.showReplyEditor}/>
							</div>
						)}
					</div>
				)}
				{this.renderReplies()}
			</div>
		);
	},


	renderReply (item) {
		return (
			<Panel item={item} key={item.getID()}/>
		);
	}

});

export default Panel;
