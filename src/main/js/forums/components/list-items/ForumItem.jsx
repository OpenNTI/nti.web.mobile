'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

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

	render: function() {

		if (this.state.loading) {
			return <LoadingInline />;
		}
		var {item} = this.props;
		// List component is passed in as a prop to dodge a circular import (of List).
		var TopicsComponent = this.props.topicsComponent;
		var topicList = TopicsComponent && this.state.topTopics.length > 0 ?
			<TopicsComponent container={{Items:this.state.topTopics}} itemProps={{parentPath: this._getForumPath()}}/> :
			null;
		return (
			<div className="forum-item">
				<h3><a href={this._href()}>{item.title}</a></h3>
				{topicList}
			</div>
		);
	}
});
