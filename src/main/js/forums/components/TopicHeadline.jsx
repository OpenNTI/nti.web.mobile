/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var TopicHeadline = React.createClass({

	render: function() {

		var {topic} = this.props;

		return (
			<h1>{topic.headline.title}</h1>
		);
	}

});

module.exports = TopicHeadline;
