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
		Store.getUserAgreement().then(function(result) {
			this.setState({
				content: result.body,
				loading: false
			});
		}.bind(this));
	},

	render: function() {

		if (this.state.loading) {
			return <div className="agreement-wrapper"><Loading /></div>
		}

		return (
				<div className="agreement-wrapper"><div className="agreement" dangerouslySetInnerHTML={{__html: this.state.content}} /></div>
				// <iframe
				// 	className="agreement"
					
				// 	src={this.state.url}
				// ></iframe>
		);
	}

});

module.exports = UserAgreement;
