/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Redirect = React.createClass({
	mixins: [Router.NavigatableMixin],

	propTypes: {
		force: React.PropTypes.bool,
		location: React.PropTypes.string
	},

	_redirect: function(loc) {
		if (this.props.force) {
			console.debug('Forceful redirect to: %s', loc);
			return location.replace(loc);
		}
		this.navigate(loc, {replace: true});
	},

	componentDidUpdate: function() {
		try {
			this._nredirect(this.props.location);
		} catch (e) {
			console.error(e.stack);
		}
	},

	componentDidMount: function() {
		this._redirect(this.props.location);
	},

	render: function() {
		return (<div>Redirecting to {this.props.location}</div>);
	}

});

module.exports = Redirect;
