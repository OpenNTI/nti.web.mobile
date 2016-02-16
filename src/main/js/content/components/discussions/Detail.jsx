import React from 'react';

import Conditional from 'common/components/Conditional';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {Panel as Body} from 'modeled-content';

// import {scoped} from 'common/locale';
// const t = scoped('DISCUSSIONS');

import AuthorInfo from './AuthorInfo';
import Context from './Context';
import ItemActions from './ItemActions';
import ReplyEditor from './ReplyEditor';
import Reply from './Panel';

import NotePanelBehavior from './NotePanelBehavior';

export default React.createClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		NavigatableMixin,
		NotePanelBehavior
	],

	propTypes: {
		contentPackage: React.PropTypes.object,

		item: React.PropTypes.object,

		/**
		 * Turns off alot of things for activity views.
		 *
		 * @type {bool}
		 */
		lite: React.PropTypes.bool
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
					<Conditional condition={!item.placeholder} tag={AuthorInfo} item={item} lite={lite} />

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
