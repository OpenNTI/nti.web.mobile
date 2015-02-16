'use strict';

var React = require('react/addons');
var List = require('./List');
var _t = require('common/locale').scoped('FORUMS');

var TopicList = React.createClass({
	render: function() {
		var emptyText = _t('emptyTopicList');

		return <List {...this.props} className="forum-topics" emptyText={emptyText} />;
	}

});

module.exports = TopicList;
