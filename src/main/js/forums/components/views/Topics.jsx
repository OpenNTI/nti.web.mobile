/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Link = require('react-router-component').Link;
var AnalyticsStore = require('analytics/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicList = require('../TopicList');
var Loading = require('common/components/Loading');
var Store = require('../../Store');
var LoadForum = require('../../mixins/LoadForum');

var Topics = React.createClass({

	mixins: [NavigatableMixin, LoadForum],

	getInitialState: function() {
		return {
			loading: true 
		};
	},

	componentWillUnmount: function() {
		AnalyticsStore.pushHistory(NTIID.decodeFromURI(this.props.forumId));
	},

	__getContext: function() {
		var getContextProvider = this.props.contextProvider || Breadcrumb.noContextProvider;
		return getContextProvider().then(context => {
			return context;
		});
	},

	_getForum() {
		return Store.getForum(this.props.forumId);
	},

	_canCreateTopic() {
		var forum = this._getForum();
		return !!(forum && forum.hasLink('add'));
	},

	_createTopicLink() {
		if (!this._canCreateTopic()) {
			return null;
		}
		return <Link className="action-link create-topic" href="/newtopic/">Create a discussion <i className="arrow-right"/></Link>;
	},

	render: function() {

		if (this.state.loading) {
			return <Loading/>;
		}

		var {forumId} = this.props;
		var forumContents = Store.getObjectContents(forumId);

		return (
			<div>
				<Breadcrumb contextProvider={this.__getContext} />
				<section>
					{this._createTopicLink()}
					<TopicList container={forumContents}/>
				</section>
			</div>
		);
	}

});

module.exports = Topics;
