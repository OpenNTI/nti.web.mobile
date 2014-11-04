/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Loading = require('./Loading');

var Redirect = React.createClass({
	mixins: [Router.NavigatableMixin],

	propTypes: {
		force: React.PropTypes.bool,
		location: React.PropTypes.string
	},

	_redirect: function(props) {
		var loc = props.location;
		var location = global.location;
		var currentFragment = location && location.hash;

		if (props.force) {
			console.debug('Forceful redirect to: %s', loc);
			return location.replace(loc);
		}

		if (loc && loc.indexOf('#') === -1 && currentFragment) {
			loc = loc +
					(currentFragment.charAt(0) !== '#' ? '#' : '') +
					currentFragment;
		}

		console.debug('Redirecting to %s', loc);
		this.navigate(loc, {replace: true});
	},


	componentDidMount: function() {
		this._redirect(this.props);
	},


	componentWillReceiveProps: function(props) {
		this._redirect(props);
	},


	render: function() {
		return (<Loading/>);
	}
});

module.exports = Redirect;
