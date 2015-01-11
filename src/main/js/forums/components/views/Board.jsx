/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('../List');
var TopicList = require('../TopicList');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

module.exports = React.createClass({

	mixins: [NavigatableMixin],

	_renderList: function() {
		var {list} = this.props;
		if (!Array.isArray(list) || list.length === 0) {
			return <div>No Forums</div>;
		}

		var itemProps = {
			topicsComponent: TopicList // passing in the component to avoid a circular import of List
		};

		return (
			<List container={{Items: list}} className="forum-list" itemProps={itemProps} />
		);
	},

	render: function() {
		return (
			<nav className="forum">
				{this._renderList()}
			</nav>
		);
	}

});
