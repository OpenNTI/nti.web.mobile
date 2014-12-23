'use strict';

var React = require('react/addons');

var Redirect = require('navigation/components/Redirect');

module.exports = React.createClass({
	displayName: 'HomeView',

	render: function() {
		return (<Redirect location={this.props.basePath + 'library/'} />);
	}
});
