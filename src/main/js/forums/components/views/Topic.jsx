/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Store = require('../../Store');
var Api = require('../../Api');
var Constants = require('../../Constants');
var NTIID = require('dataserverinterface/utils/ntiids');

var TopicHeadline = require('../TopicHeadline');
var TopicComments = require('../TopicComments');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var Loading = require('common/components/Loading');

module.exports = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: true
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
		}
	},

	_loadData: function(topicId) {
		Api.getObjectContents(topicId, {
			sortOn: 'CreatedTime',
			sortOrder: 'ascending',
			filter: 'TopLevel'
		});
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		var href = this.makeHref(this.getPath());
		var topic = Store.getObject(this.props.topicId);
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

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var topic = Store.getObject(this.props.topicId);
		var topicContents = Store.getObjectContents(this.props.topicId);

		return (
			<div>
				<Breadcrumb contextProvider={this.__getContext}/>
				<TopicHeadline post={topic.headline} />
				<TopicComments container={topicContents} topic={topic} />
			</div>
		);
	}

});
