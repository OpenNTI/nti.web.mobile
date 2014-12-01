/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PreliminaryForm = require('./PreliminaryForm');

var View = React.createClass({

	render: function() {
		return (
			<PreliminaryForm />
		);
	}

});

module.exports = View;
