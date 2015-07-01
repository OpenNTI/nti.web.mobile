import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Avatar from 'common/components/Avatar';
import ContextSender from 'common/mixins/ContextSender';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';
import SharedWithList from 'common/components/SharedWithList';

import NavigatableMixin from 'common/mixins/NavigatableMixin';


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
		ContextSender,
		NavigatableMixin,
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


	componentDidMount () { this.updatePageSource(); },
	componentWillReceiveProps (props) { this.updatePageSource(props); },

	updatePageSource (props = this.props) {
		let {pageSource, item} = props;
		this.setPageSource(pageSource, item.getID());
	},


	getContext () {
		let {item} = this.props;

		return Promise.resolve({
			label: item.title || 'Note',
			href: this.makeHref(encodeForURI(item.getID()))
		});
	},


	render () {
		let {replying} = this.state;
		let {item, lite} = this.props;
		let {body, creator, title} = item;
		let date = item.getLastModified();


		return (
			<div className="discussion-detail">
				<div className="root">
					<div className="author-info">
						<Avatar username={creator}/>
						<div className="meta">
							<LuckyCharms item={item}/>
							<h1 className="title">{title}</h1>
							<div className="name-wrapper">
								<DisplayName username={creator} localeKey={lite ? void 0 : 'CONTENT.DISCUSSIONS.postedBy'}/>
								<DateTime date={date} relative/>
								<SharedWithList item={item}/>
							</div>
						</div>
					</div>

					{!lite && ( <Context item={item}/> )}

					<Body body={body}/>

					{!lite && (
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
