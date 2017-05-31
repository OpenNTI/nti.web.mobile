import React from 'react';

import createReactClass from 'create-react-class';

import {encodeForURI} from 'nti-lib-ntiids';

import {
	DateTime,
	Mixins
} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import {Panel as Body} from 'modeled-content';

import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';
import AuthorInfo from './AuthorInfo';

import NotePanelBehavior from './NotePanelBehavior';

const t = scoped('UNITS');

const Panel = createReactClass({
	displayName: 'content:discussions:Panel',
	mixins: [
		Mixins.NavigatableMixin,
		NotePanelBehavior
	],


	propTypes: {
		item: React.PropTypes.object.isRequired,

		lite: React.PropTypes.bool,
		rooted: React.PropTypes.bool
	},

	getHref () {
		const {item} = this.props;
		return this.makeHref(`/${encodeForURI(item.getID())}`);
	},


	onEdit () {
		const {item} = this.props;
		this.navigate(`/${encodeForURI(item.getID())}/edit`);
	},


	render () {
		const {state: {replying}, props: {item, rooted, lite}} = this;
		const {body, placeholder, replyCount = 0} = item;
		const date = item.getCreatedTime();

		return (
			<div className="discussion-reply">
				{ placeholder ? (
					<div className="placeholder">This message has been deleted.</div>
				) : (
					<div className="note-body">
						<AuthorInfo item={item} lite/>

						<Body body={body}/>

						{replying ? (
							<div className="footer">
								<ReplyEditor replyTo={item} onCancel={this.hideReplyEditor} onSubmitted={this.hideReplyEditor}/>
							</div>
						) : (
							<div className="footer">
								<DateTime date={date} relative/>
								{!rooted && ( <a className="comment-link" href={this.getHref()}>{t('comments', {count: replyCount})}</a> )}
								{!lite && <ItemActions item={item} onReply={this.showReplyEditor} onEdit={this.onEdit}/>}
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
