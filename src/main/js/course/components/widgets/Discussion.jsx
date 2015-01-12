'use strict';

var React = require('react/addons');
var getService = require('common/Utils').getService;
var path = require('path');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

module.exports = React.createClass({
	displayName: 'CourseOverviewDiscussion',

	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.discussion/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getNTIIDs: function() {
		var i = this.props.item,
			id = i && i.NTIID;
		return id ? id.split(' ') : [];
	},


	getNTIID: function () {
		var ids = this.getNTIIDs();
		return ids[this.state.ntiidIndex];
	},


	getInitialState: function(){
		//var ids = this.getNTIIDs();
		return {
			count: 0,
			commentType: ' Comments',
			icon: null,
			title: '',
			ntiidIndex: 0
		};
	},


	componentDidMount: function() {
		this.resolveIcon(this.props);
		this.resolveCommentCount();
	},

	resolveIcon: function(props) {
		this.setState({	icon: null	});
		if (!props.item.icon) {
			return;
		}

		props.course.resolveContentURL(props.item.icon)
			.then(function(u) {
				this.setState({
					iconResolved: true,
					icon: u
				});
			}.bind(this));
	},


	resolveCommentCount: function() {
		var id = this.getNTIID();

		return getService()
			.then(function(service){ return service.getObject(id); })
			.then(this.fillInDataFrom)
			.catch(this.tryNextId)
			.catch(this.markDisabled);
	},


	tryNextId: function() {
		var ids = this.getNTIIDs();
		var i = this.state.ntiidIndex + 1;
		if (i >= ids.length) {
			return Promise.reject('No more');
		}

		this.setState({ntiidIndex: i});
		return this.resolveCommentCount();
	},


	fillInDataFrom: function(o) {
		if (this.isMounted()) {
			this.setState({
				title: o.title,
				count: o.PostCount || o.TopicCount || 0,
				commentType: o.hasOwnProperty('TopicCount') ? ' Discussions' : ' Comments',
				href: this.getHref(o)
			});
		}
	},

	getHref: function(o) {
		var bin = 'jump';
		var boardId = NTIID.encodeForURI(this.props.course.Discussions.getID());
		var forumId = NTIID.encodeForURI(o.ContainerId);
		var topicId = NTIID.encodeForURI(o.NTIID);
		var h = path.join('d', bin, boardId, forumId, topicId) + '/'; 
		return this.makeHref(h);
	},

	markDisabled: function() {
		if (this.isMounted()) {
			this.setState({
				disabled: true,
				count: '',
				commentType: ''
			});
		}
	},


	render: function() {
		var props = this.props;
		var item = props.item;
		var title = item.title || this.state.title || 'Discussion';

		var disabled = this.state.disabled ? 'disabled' : '';

		return (
			<a className={'overview-discussion ' + disabled} href={this.state.href||'#'}>
				<img src={this.state.icon}></img>
				<div className="wrap">
					<div className="title">{title}</div>
					<div className="comments">{this.state.count + this.state.commentType}</div>
				</div>
			</a>
		);
	}

});
