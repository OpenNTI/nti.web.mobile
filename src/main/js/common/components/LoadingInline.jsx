/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'LoadingInline',

	render: function() {
		return (<ul className="loader"><li/><li/><li/></ul>);
	}

});
