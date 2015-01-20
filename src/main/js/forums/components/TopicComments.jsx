/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
var t = require('common/locale').scoped('FORUMS');
var AddComment = require('./AddComment');

var TopicComments = React.createClass({

	render: function() {

		var {container} = this.props;
		var itemCount = container.Items.length;

		return (
			<section className="comments">
				<h1>{t('replies', {count: itemCount})}</h1>
				<AddComment topic={this.props.topic} />
				<List className="forum-replies" {...this.props} itemProps={{topic: this.props.topic}} />
			</section>
		);
	}
});

module.exports = TopicComments;
