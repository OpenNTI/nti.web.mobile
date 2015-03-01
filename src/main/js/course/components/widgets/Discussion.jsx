import path from 'path';
import React from 'react';

import {encodeForURI} from 'dataserverinterface/utils/ntiids';

import {getService} from 'common/utils';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import LoadingMask from 'common/components/Loading';

export default React.createClass({
	displayName: 'CourseOverviewDiscussion',

	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.discussion/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getNTIIDs () {
		var i = this.props.item,
			id = i && i.NTIID;
		return id ? id.split(' ') : [];
	},


	getNTIID  () {
		var ids = this.getNTIIDs();
		return ids[this.state.ntiidIndex];
	},


	getInitialState (){
		//var ids = this.getNTIIDs();
		return {
			count: 0,
			commentType: ' Comments',
			icon: null,
			title: '',
			ntiidIndex: 0,
			loading: true
		};
	},


	componentDidMount () {
		this.resolveIcon(this.props);
		this.resolveItem();
	},


	resolveIcon (props) {
		this.setState({	icon: null	});
		if (!props.item.icon) {
			return;
		}

		props.course.resolveContentURL(props.item.icon)
			.then(icon=> this.setState({iconResolved: true, icon}));
	},


	resolveItem () {
		var id = this.getNTIID();

		return getService()
			.then(service => service.getObject(id))
			.then(this.fillInDataFrom)
			.catch(this.tryNextId)
			.catch(this.markDisabled);
	},


	tryNextId () {
		var ids = this.getNTIIDs();
		var i = this.state.ntiidIndex + 1;
		if (i >= ids.length) {
			return Promise.reject('No more');
		}

		this.setState({ntiidIndex: i});
		return this.resolveItem();
	},


	fillInDataFrom (o) {
		var isForum = o.hasOwnProperty('TopicCount');
		if (this.isMounted()) {

			this.setState({
				loading: false,
				title: o.title,
				count: o.PostCount || o.TopicCount || 0,
				commentType: isForum ? ' Discussions' : ' Comments',
				href: isForum ? this.getForumHref(o) : this.getTopicHref(o)
			});
		}
	},


	getTopicHref (o) {
		var forumHref = this.getForumHref(o);
		if(!forumHref) {
			return null;
		}
		var topicId = encodeForURI(o.NTIID);
		return path.join(forumHref, topicId) + '/';
	},


	_getBoardFor (o) {
		var course = this.props.course || {};
		var {Discussions, ParentDiscussions} = course;

		return [Discussions, ParentDiscussions].reduce((found, board)=>
				found || (board && o.href.indexOf(board.href) !== -1 && board.getID()), null);
	},


	getForumHref (o) {
		var discussions = this._getBoardFor(o);
		if(!discussions) {
			return null;
		}

		var bin = 'jump';
		var isForum = o.hasOwnProperty('TopicCount');

		var boardId = encodeForURI(discussions);
		var forumId = encodeForURI(isForum ? o.NTIID : o.ContainerId);

		var h = path.join('..', 'd', bin, boardId, forumId) + '/';
		return this.makeHref(h);
	},


	markDisabled () {
		if (this.isMounted()) {
			this.setState({
				loading: false,
				disabled: true,
				href: null,
				count: '',
				commentType: ''
			});
		}
	},


	render () {
		var {props} = this;
		var {item} = props;
		var title = item.title || this.state.title || 'Discussion';

		var disabled = this.state.disabled ? 'unavailable' : '';

		return (
			<LoadingMask loading={this.state.loading}
				tag="a" href={this.state.href}
				className={'overview-discussion ' + disabled}>
				<img src={this.state.icon}></img>
				<div className="wrap">
					<div className="title">{title}</div>
					<div className="comments">{this.state.count + this.state.commentType}</div>
				</div>
			</LoadingMask>
		);
	}

});
