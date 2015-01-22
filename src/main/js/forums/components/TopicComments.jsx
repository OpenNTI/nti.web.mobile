/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
// var t = require('common/locale').scoped('FORUMS');
// var AddComment = require('./AddComment');

var TopicComments = React.createClass({

	render: function() {

		var {topic} = this.props;
		// var itemCount = topic.PostCount;

		return (
			<section className="comments">
				<List className="forum-replies" {...this.props} itemProps={{topic: topic}} />
			</section>
		);
	}
});

module.exports = TopicComments;
