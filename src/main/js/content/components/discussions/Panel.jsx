import React from 'react';

import {encodeForURI} from 'nti-lib-ntiids';

import Avatar from 'common/components/Avatar';
import Conditional from 'common/components/Conditional';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';

import {scoped} from 'common/locale';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Panel as Body} from 'modeled-content';

import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';

import NotePanelBehavior from './NotePanelBehavior';

const t = scoped('UNITS');

const Panel = React.createClass({
	displayName: 'content:discussions:Panel',
	mixins: [
		NavigatableMixin,
		NotePanelBehavior
	],


	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getHref () {
		const {item} = this.props;
		return this.makeHref(`/${encodeForURI(item.getID())}`);
	},

	render () {
		const {replying} = this.state;
		const {item} = this.props;
		const {body, creator, placeholder, replyCount = 0} = item;
		const date = item.getCreatedTime();

		return (
			<div className="discussion-reply">
				{ placeholder ? (
					<div className="placeholder">This message has been deleted.</div>
				) : (
					<div className="body">
						<LuckyCharms item={item}/>
						<Conditional condition={!item.placeholder} className="author-info">
							<Avatar entity={creator}/>
							<div className="meta">
								<DisplayName entity={creator}/>
								<div className="name-wrapper"/>
							</div>
						</Conditional>

						<Body body={body}/>

						{replying ? (
							<div className="footer">
								<ReplyEditor item={item} onCancel={this.hideReplyEditor} onSubmitted={this.hideReplyEditor}/>
							</div>
						) : (
							<Conditional condition={!item.placeholder} className="footer">
								<DateTime date={date} relative/>
								<ItemActions item={item} isTopLevel onReply={this.showReplyEditor}/>
							</Conditional>
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
