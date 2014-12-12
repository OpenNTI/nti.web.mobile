/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'Feedback',

	componentDidMount: function() {
		Store.addChangeListener(this.synchronizeFromStore);
		this.synchronizeFromStore();
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps: function(props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore: function() {
		this.forceUpdate();
	},


	render: function() {
		var quiz = this.props.assessment;
		if (!Store.isAssignment(quiz) || !Store.isSubmitted(quiz)) {
			return null;
		}

		return (
			<div>
				Feedback goes HERE!
			</div>
		);
	}
});
