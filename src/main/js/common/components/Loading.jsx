/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var isEmpty = require('dataserverinterface/utils/isempty');

module.exports = React.createClass({
	displayName: 'Loading',

	propType: {
		loading: React.PropTypes.bool,
		message: React.PropTypes.string
	},


	getDefaultProps: function() {
		return {
			message: 'Loading'
		};
	},


	render: function() {

		if (!isEmpty(this.props.children) && !this.props.loading) {
			return this.transferPropsTo(React.DOM.div(null, this.props.children));
		}

		return (
			<figure className="loading">
				<div className="m spinner"></div>
				<figcaption>{this.props.message}</figcaption>
			</figure>
		);
	}
});
