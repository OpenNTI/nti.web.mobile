/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
// var Store = require('../../Store');
var BoardGroup = require('../BoardGroup');

module.exports = React.createClass({

	render: function() {

		var {groups, groupId} = this.props;

		if (!groups) {
			return null;
		}

		var group = {
			key: groupId,
			boards: groups[groupId]
		};

		return (
			<BoardGroup group={group} />
		);
	}

});
