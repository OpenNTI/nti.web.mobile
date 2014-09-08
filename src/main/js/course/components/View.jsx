/** @jsx React.DOM */
'use strict';

var React = require('react/addons');


module.exports = React.createClass({
	propTypes: {
		course: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {
		// Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		// Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.course !== this.props.course) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		var courseId = decodeURIComponent(props.course);

	},

	render: function() {
		return (
			<div>course {this.props.course}</div>
		);
	}
});
