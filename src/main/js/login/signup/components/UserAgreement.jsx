/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var Store = require('../Store');
var Loading = require('common/components/Loading');

var UserAgreement = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			url: null
		};
	},

	componentDidMount: function() {
		Store.getUserAgreementUrl().then(function(result) {
			this.setState({
				loading: false,
				url: result
			});
		}.bind(this));
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />
		}

		return (
				<iframe
					className="agreement"
					seamless="seamless"
					src={this.state.url}
				></iframe>
		);
	}

});

module.exports = UserAgreement;
