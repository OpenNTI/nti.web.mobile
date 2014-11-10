/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Actions = require('../Actions');

var View = React.createClass({

	propTypes: {
		enrollment: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		Actions.getPricing().then(function(result) {
			this.setState({
				loading: false
			});
		}.bind(this));
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		return (
			<div>
				Do Store Enrollment
			</div>
		);
	}

});

module.exports = View;
