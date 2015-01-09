/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var BoardGroup = require('../BoardGroup');

var RootView = React.createClass({

	render: function() {

		var discussions = this.props.discussions || {};

		return (
			<ul className="forum-board-groups">
				{Object.keys(discussions).map(key => {
					var group = {
						key: key,
						boards: discussions[key]
					};
					return <li key={key}><BoardGroup group={group} /></li>;
				})}
			</ul>
		);
	}

});

module.exports = RootView;
