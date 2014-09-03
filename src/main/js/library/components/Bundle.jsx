/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Actions = require('../LibraryActions');

module.exports = React.createClass({
	propTypes: {
		contentBundle: React.PropTypes.object.isRequired
	},


	componentWillMount: function() {
		this.props.contentBundle.addListener('changed', this._onChange);
	},


	componentWillUnmount: function() {
		this.props.contentBundle.removeListener('changed', this._onChange);
	},


	_onChange: function(pkg) {
		this.setState(this.state);//force rerender
	},


	render: function() {
		var p = this.props.contentBundle;
		return (
			<div>
				<img src={p.icon}/>
				<div>
					<h3>{p.title}</h3>
					<h5>{p.author}</h5>
				</div>
			</div>
		);
	}
});
