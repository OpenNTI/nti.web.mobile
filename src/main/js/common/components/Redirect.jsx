/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Redirect = React.createClass({
	mixins: [Router.NavigatableMixin],

	_redirect: function(loc) {
		this.navigate(loc, {replace: true});
	},

	componentDidUpdate: function() {
		this._nredirect(this.props.location);
	},

	componentDidMount: function() {
		this._redirect(this.props.location);
	},

	render: function() {
		return (<div>Redirecting to {this.props.location}</div>);
	}

});

module.exports = Redirect;
