/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Breadcrumb',


	componentDidMount: function() {},


	componentWillUnmount: function() {},


	render: function() {
		return (
			<ul className="breadcrumbs" role="menubar" ariaLabel="breadcrumbs">
				<li role="menuitem"><a href="#">Home</a></li>
			    <li role="menuitem"><a href="#">Features</a></li>
				<li role="menuitem" className="unavailable" ariaDisabled="true">
					<a href="#">Gene Splicing</a>
				</li>
				<li role="menuitem" className="current">
					<a href="#">Cloning</a>
				</li>
			</ul>
		);
	}
});
