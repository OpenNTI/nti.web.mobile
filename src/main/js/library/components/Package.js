/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Actions = require('../LibraryActions');

module.exports = React.createClass({
	propTypes: {
		contentPackage: React.PropTypes.object.isRequired
	},


	componentWillMount: function() {
		this.props.contentPackage.addListener('changed', this._onChange);
	},


	componentWillUnmount: function() {
		this.props.contentPackage.removeListener('changed', this._onChange);
	},


	_onChange: function(pkg) {
		this.setState(this.state);//force rerender
	},


	render: function() {
		var p = this.props.contentPackage;
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
