/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Link = require('react-router-component').Link;
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var BarItem = React.createClass({

	mixins: [NavigatableMixin],

	isActive: function() {
		return this.getPath().indexOf(this.props.href) === 0;
	},

	render: function() {

		var css = ['item'];
		if(this.isActive()) {
			css.push('active');
		}

		return (
			<Link className={css.join(' ')} href={this.props.href}><label>{this.props.children}</label></Link>
		);
	}

});

var IconBar = React.createClass({

	render: function() {
		return (
			<div className="icon-bar three-up">
				<BarItem href="/courses/">Courses</BarItem>
				<BarItem href="/books/">Books</BarItem>
				<BarItem href="/catalog/">Catalog</BarItem>
			</div>
		);
	}

});

module.exports = IconBar;
