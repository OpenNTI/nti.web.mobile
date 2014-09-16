/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('../../common/components/Loading');

var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'MediaView',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		videoId: React.PropTypes.string
	},

	getInitialState: function() {
		return {};
	},

	render: function() {

		if (this.state.loading) {
			return (<Loading/></div>);
		}

		return (
			<div/>
		);
	}
});
