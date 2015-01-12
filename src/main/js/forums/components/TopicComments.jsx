/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');

var TopicComments = React.createClass({
	render: function() {
		return (
			<section className="comments">
				<h1>Comments</h1>
				<List className="forum-replies" {...this.props} />
			</section>
		);
	}
});

module.exports = TopicComments;
