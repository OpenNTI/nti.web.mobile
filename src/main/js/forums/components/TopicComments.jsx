/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
var t = require('common/locale').scoped('FORUMS');
var AddComment = require('./AddComment');
var Store = require('../Store');
var Constants = require('../Constants');

var TopicComments = React.createClass({

	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	_storeChanged(event) {
		switch(event.type) {
			case Constants.COMMENT_ADDED:
				console.debug('comment added', event);
				break;
		}
	},

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
