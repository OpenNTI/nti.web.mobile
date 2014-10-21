/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Redirect = require('common/components/Redirect');


module.exports = React.createClass({
	displayName: 'HomeView',

	render: function() {
		return (<Redirect location='courseware/' />);
	}
});
