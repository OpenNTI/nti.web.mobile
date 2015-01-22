/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Actions = require('../../Actions');
var Api = require('../../Api');
var Constants = require('../../Constants');
var NTIID = require('dataserverinterface/utils/ntiids');

var TopicHeadline = require('../TopicHeadline');
var TopicComments = require('../TopicComments');
var Breadcrumb = require('common/components/Breadcrumb');
var Button = require('common/forms/components/Button');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Prompt = require('prompts');
var Notice = require('common/components/Notice');
var Loading = require('common/components/Loading');
var Err = require('common/components/Error');
var t = require('common/locale').scoped('FORUMS');
var ReportLink = require('../ReportLink');

module.exports = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: true,
			deleted: false
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.topicId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.topicId !== this.props.topicId) {
			this._loadData(nextProps.topicId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
			case Constants.OBJECT_CONTENTS_CHANGED:
				if (event.objectId === this.props.topicId) {
					this.setState({
						loading: false
					});
				}
				break;

			case Constants.COMMENT_ADDED:
				var {topicId} = this.props;
				var {result} = event.data||{};
				if (result.ContainerId === NTIID.decodeFromURI(topicId) && !result.inReplyTo) {
					this._loadData(topicId);
				}
				break;

			case Constants.OBJECT_DELETED:
				var {topicId} = this.props;
				var fullTopicId = NTIID.decodeFromURI(topicId);
				var o = event.object;
				if (!o.inReplyTo && event.object.ContainerId === fullTopicId) {
					this._loadData(this.props.topicId);	
				}
				if (o.getID && o.getID() === fullTopicId) {
					this.setState({
						deleted: true
					});
				}
				break;
		}
	},

	_loadData: function(topicId=this.props.topicId) {
		Api.getTopicContents(topicId)
		.then(
			result => {
				Store.setObject(topicId, result.object);
				Store.setObjectContents(topicId, result.contents);
			},
			reason => {
				// console.error('Failed to load topic contents.', reason);
				this.setState({
					error: reason
				});
			}
		);
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref(this.getPath());
		var topic = this._topic();
		var title = topic && topic.headline ? topic.headline.title : 'Topic';
		return getContextProvider().then(context => {
			context.push({
				// label: 'Topic',
				label: title,
				href: href
			});
			return context;
		});
	},

	_topic() {
		return Store.getObject(this.props.topicId);
	},

	_deleteTopic: function() {
		Prompt.areYouSure(t('deleteTopicPrompt')).then(() => {
			Actions.deleteTopic(this._topic());
		},
		()=>{});
	},

	render: function() {

		var breadcrumb = <Breadcrumb contextProvider={this.__getContext}/>;

		if (this.state.error) {
			var {error} = this.state;
			return (error||{}).statusCode === 404 ? <div>{breadcrumb}<Notice>This topic could not be found.</Notice></div> : <Err error={error} />;
		}

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.deleted) {
			return <div>
				{breadcrumb}
				<Notice>This topic has been deleted.</Notice>
			</div>;
		}

		var topic = this._topic();
		var topicContents = Store.getObjectContents(this.props.topicId);
		var canEdit = topic.hasLink('edit');
		var canReport = topic.hasLink('flag')||topic.hasLink('flag.metoo');

		return (
			<div>
				{breadcrumb}
				<TopicHeadline post={topic.headline} />
				{canEdit && <Button onClick={this._deleteTopic}>Delete</Button>}
				{canReport && <ReportLink item={topic} />}
				<TopicComments container={topicContents} topic={topic} />
			</div>
		);
	}

});
