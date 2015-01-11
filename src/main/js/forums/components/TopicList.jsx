/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');

var TopicList = React.createClass({

	render: function() {
		return <List {...this.props} className="forum-topics" />;
	}

});

module.exports = TopicList;
