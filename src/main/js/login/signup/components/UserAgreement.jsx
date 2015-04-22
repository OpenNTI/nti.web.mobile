

var React = require('react');
var Store = require('../Store');
var ErrorWidget = require('common/components/Error');
var Loading = require('common/components/Loading');
// var preventOverscroll = require('common/thirdparty/prevent-overscroll');

var UserAgreement = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			url: null
		};
	},

	componentDidMount: function() {
		Store.getUserAgreement()
			.then(this.setContent, this.__setError);
	},


	__setError: function (reason) {
		this.setState({
			error: reason,
			loading: false
		});
	},


	setContent: function(result) {
		this.setState({
			content: result.body,
			loading: false
		});
		// preventOverscroll(React.findDOMNode(this).querySelector('.agreement'));
	},


	render: function() {

		if (this.state.loading) {
			return (<div className="agreement-wrapper"><Loading /></div>);
		}

		if (this.state.error) {
			return (<div className="agreement-wrapper"><ErrorWidget error={this.state.error} /></div>);
		}

		return (
				<div className="agreement-wrapper"><div className="agreement"
					dangerouslySetInnerHTML={{__html: this.state.content || ''}} /></div>
				// <iframe
				// 	className="agreement"

				// 	src={this.state.url}
				// ></iframe>
		);
	}

});

module.exports = UserAgreement;
