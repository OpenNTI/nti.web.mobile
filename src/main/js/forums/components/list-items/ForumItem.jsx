'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var t = require('common/locale').scoped('FORUMS');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [require('./Mixin'), NavigatableMixin],

	statics: {
		inputType: [
			Constants.types.FORUM
		]
	},

	getInitialState() {
		return {
			loading: true,
			topTopics: []
		};
	},

	componentDidMount: function() {
		this._load(this.props.item);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.item !== this.props.item) {
			this._load(nextProps.item);
		}
	},

	_load: function(forum) {
		forum.getTopTopics()
		.then(topics => {
			this.setState({
				loading: false,
				topTopics: topics
			});
		});
	},

	_href: function() {
		var path = [NTIID.encodeForURI(this.props.item.getID()), ''];
		if (this.props.parentPath) {
			path.unshift(this.props.parentPath);
		}
		return path.join('/');
	},

	_getForumPath: function() {
		return this.getPath().concat(this._href());
	},

	_renderTopTopics: function() {
		// List component is passed in as a prop to dodge a circular import (of List).
		var TopicsComponent = this.props.topicsComponent;
		return TopicsComponent ?
			<TopicsComponent
				container={{Items:this.state.topTopics}}
				itemProps={{parentPath: this._getForumPath()}}/> :
			null;
	},

	render: function() {

		if (this.state.loading) {
			return <LoadingInline />;
		}
		var {item} = this.props;
		var topicCount = t('topicCount', { count: item.TopicCount });
		
		return (
			<div className="forum-item">
				<h3>
					<a className="title" href={this._href()}>
						{item.title} <span className="topic-count">({topicCount})</span>
					</a>
					<a className="see-all" href={this._href()}>See All</a>
				</h3>
				{this._renderTopTopics()}
			</div>
		);
	}
});
