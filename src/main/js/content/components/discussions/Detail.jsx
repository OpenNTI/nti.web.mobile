import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from '@nti/web-commons';

import {Panel as Body} from 'modeled-content';

import AuthorInfo from './AuthorInfo';
import Context from './Context';
import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';
import Reply from './Panel';
import NotePanelBehavior from './NotePanelBehavior';


export default createReactClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		Mixins.NavigatableMixin,
		NotePanelBehavior
	],

	propTypes: {
		contentPackage: PropTypes.object,

		item: PropTypes.object,

		/**
		 * Turns off a lot of things for activity views.
		 *
		 * @type {bool}
		 */
		lite: PropTypes.bool
	},


	onEdit () {
		this.navigate('/edit');
	},


	render () {
		const {state: {replying}, props: {contentPackage, item, lite}} = this;
		const {body} = item;
		const isReply = item.isReply();


		return (
			<div className={`discussion-${isReply ? 'reply' : 'detail'}`}>
				<div className="root">
					{!item.placeholder && ( <AuthorInfo item={item} lite={!isReply && lite} /> )}

					{!lite && ( <Context item={item} contentPackage={contentPackage}/> )}

					{!item.placeholder && ( <Body body={body}/> )}

					{!lite && !item.placeholder && (
						replying ? (
							<ReplyEditor item={item} replyTo={item} onCancel={this.hideReplyEditor} onSubmitted={this.hideReplyEditor}/>
						) : (
							<ItemActions item={item} onReply={this.showReplyEditor} onEdit={this.onEdit}/>
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
