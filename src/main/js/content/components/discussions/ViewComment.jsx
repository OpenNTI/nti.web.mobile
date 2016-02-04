import React from 'react';

import {decodeFromURI, encodeForURI} from 'nti-lib-ntiids';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Panel from './Panel';

export default React.createClass({
	displayName: 'ViewComment',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		root: React.PropTypes.object.isRequired,
		commentId: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {};
	},


	getContext () {
		const {props: {root}, state: {item}} = this;
		const result = [];

		// if this is a reply to a comment push an item for the parent comment.
		const {inReplyTo} = (item || {});
		if (inReplyTo && inReplyTo !== root.getID()) {
			result.push({
				label: 'Comment',
				href: this.makeHref(encodeForURI(inReplyTo))
			});
		}

		// entry for this post
		result.push({
			label: 'Reply',
			href: ''
		});

		return result;
	},


	componentWillMount () {
		this.getComment();
	},


	componentWillReceiveProps (nextProps) {
		const {commentId: commentId0, root: root0} = this.props;
		const {commentId: commentId1, root: root1} = nextProps;
		if (commentId0 !== commentId1 || root0 !== root1) {
			this.replaceState(this.getInitialState());
			this.getComment(nextProps);
		}
	},


	getComment ({root, commentId} = this.props) {
		root.getReply(decodeFromURI(commentId))
			.then(item => this.setState({item}))
			.catch(error => this.setState({error}));
	},


	render () {

		const {error, item} = this.state;

		if (error) {
			return ( <Err error={error}/> );
		}

		return !item ? (
			<Loading/>
		) : (
			<div className="comment-view">
				<Panel item={item} rooted/>
			</div>
		);
	}
});
