/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var BoardGroup = require('./BoardGroup');

var RootView = React.createClass({

	render: function() {

		var discussions = this.props.discussions || {};

		return (
			<ul>
				{Object.keys(discussions).map(key => {
					var group = {
						key: key,
						items: discussions[key]
					};
					return <li><BoardGroup group={group} /></li>;
				})}
			</ul>
		);
	}

});

module.exports = RootView;
