/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('../../common/components/Loading');

var Navigation = require('../../navigation');
var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'OutlineView',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		Navigation.Actions.openDrawer();
	},

	render: function() {

		// if (this.state.loading) {
		// 	return (<Loading/></div>);
		// }

		return (
			<div>
				Click the left-hand hamburger menu...
			</div>
		);
	}
});
