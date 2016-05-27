import path from 'path';
import React from 'react';
import cx from 'classnames';

import {encodeForURI} from 'nti-lib-ntiids';

import {getService} from 'nti-web-client';

import {Mixins} from 'nti-web-commons';
import {Loading as LoadingMask} from 'nti-web-commons';

export default React.createClass({
	displayName: 'CourseOverviewDiscussion',

	mixins: [Mixins.NavigatableMixin],

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
		let i = this.props.item,
			id = i && i.NTIID;
		return id ? id.split(' ') : [];
	},


	getNTIID  () {
		let ids = this.getNTIIDs();
		return ids[this.state.ntiidIndex];
	},


	getInitialState () {
		//let ids = this.getNTIIDs();
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
			.then(icon=> this.setState({icon}));
	},


	resolveItem () {
		let id = this.getNTIID();

		return getService()
			.then(service => service.getObjectRaw(id))
			.then(this.fillInDataFrom)
			.catch(this.tryNextId)
			.catch(this.markDisabled);
	},


	tryNextId () {
		let ids = this.getNTIIDs();
		let i = this.state.ntiidIndex + 1;
		if (i >= ids.length) {
			return Promise.reject('No more');
		}

		this.setState({ntiidIndex: i});
		return this.resolveItem();
	},


	fillInDataFrom (o) {
		let isForum = o.hasOwnProperty('TopicCount');
		this.setState({
			loading: false,
			title: o.title,
			count: o.PostCount || o.TopicCount || 0,
			commentType: isForum ? ' Discussions' : ' Comments',
			href: isForum ? this.getForumHref(o) : this.getTopicHref(o)
		});
	},


	getTopicHref (o) {
		let forumHref = this.getForumHref(o);
		if(!forumHref) {
			return null;
		}
		let topicId = encodeForURI(o.NTIID);
		return path.join(forumHref, topicId) + '/';
	},

	getForumHref (o) {
		let isForum = o.hasOwnProperty('TopicCount');
		let forumId = encodeForURI(isForum ? o.NTIID : o.ContainerId);
		let h = path.join('..', 'discussions', forumId) + '/';
		return this.makeHref(h);
	},

	markDisabled () {
		this.setState({
			loading: false,
			disabled: true,
			href: null,
			count: '',
			commentType: ''
		});
	},

	render () {
		const {props: {item}, state: {icon}} = this;

		const title = item.title || this.state.title || 'Discussion';

		const disabled = this.state.disabled ? 'unavailable' : '';

		const img = icon ? {backgroundImage: `url(${icon})`} : null;

		return (
			<LoadingMask loading={this.state.loading}
				tag="a" href={this.state.href}
				className={'overview-discussion ' + disabled}>
				<div style={img} className={cx('icon', {'default': !icon})} />
				<div className="wrap">
					<div className="title">{title}</div>
					<div className="comments">{this.state.count + this.state.commentType}</div>
				</div>
			</LoadingMask>
		);
	}

});
