import React from 'react';

import Avatar from 'common/components/Avatar';
import Conditional from 'common/components/Conditional';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';
import SharedWithList from 'common/components/SharedWithList';

import Body from 'modeled-content/components/Panel';

// import {scoped} from 'common/locale';
// const t = scoped('CONTENT.DISCUSSIONS');

import Context from './Context';
import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';
import Reply from './Panel';

import NotePanelBehavior from './NotePanelBehavior';

export default React.createClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		NotePanelBehavior
	],

	propTypes: {
		pageSource: React.PropTypes.object,

		item: React.PropTypes.object,

		/**
		 * Turns off alot of things for activity views.
		 *
		 * @type {bool}
		 */
		lite: React.PropTypes.bool
	},


	render () {
		let {replying} = this.state;
		let {item, lite} = this.props;
		let {body, creator, title} = item;
		let date = item.getCreatedTime();


		return (
			<div className={`discussion-${item.isReply() ? 'reply' : 'detail'}`}>
				<div className="root">
					<Conditional condition={!item.placeholder} className="author-info">
						<Avatar entity={creator}/>
						<div className="meta">
							<LuckyCharms item={item}/>
							<h1 className="title">{title}</h1>
							<div className="name-wrapper">
								<DisplayName entity={creator} localeKey={lite ? void 0 : 'CONTENT.DISCUSSIONS.postedBy'}/>
								<DateTime date={date} relative/>
								<SharedWithList item={item}/>
							</div>
						</div>
					</Conditional>

					{!lite && ( <Context item={item}/> )}

					{!item.placeholder && ( <Body body={body}/> )}

					{!lite && !item.placeholder && (
						replying ? (
							<ReplyEditor item={item} onCancel={this.hideReplyEditor} onSubmitted={this.hideReplyEditor}/>
						) : (
							<ItemActions item={item} isTopLevel onReply={this.showReplyEditor}/>
						)
					)}


				</div>
				{!lite && this.renderReplies()}
			</div>
		);
	},


	renderReply (item) {
		return (
			<Reply item={item} key={item.getID()}/>
		);
	}
});
