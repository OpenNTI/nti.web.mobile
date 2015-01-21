/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Link = require('react-router-component').Link;
var Breadcrumb = require('common/components/Breadcrumb');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var TopicList = require('../TopicList');
var Store = require('../../Store');
var _t = require('common/locale').scoped('FORUMS');

var Topics = React.createClass({

	mixins: [NavigatableMixin],

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
		return <Link href="/newtopic/">Create a discussion</Link>;
	},

	render: function() {
		var label = _t('topicLabel');
		var {forumId} = this.props;
		var forumContents = Store.getObjectContents(forumId);

		return (
			<div>
				<Breadcrumb contextProvider={this.__getContext} />
				<section>
					<h1>{label}</h1>
					{this._createTopicLink()}
					<TopicList container={forumContents}/>
				</section>
			</div>
		);
	}

});

module.exports = Topics;
