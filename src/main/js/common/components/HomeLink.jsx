/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var CourseActions = require('../../course/Actions');

var HomeLink = React.createClass({

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_onClick: function() {
		CourseActions.setCourse(null);
	},

	render: function() {
		return (
			<a href={this.props.basePath} onClick={this._onClick}>Home</a>
		);
	}

});

module.exports = HomeLink;
