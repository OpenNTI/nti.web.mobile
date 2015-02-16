'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var ActiveLink = require('./ActiveLink');

// for computing css class names like 'two-up'
var _numbers = ['zero','one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

module.exports = React.createClass({

	mixins: [Router.NavigatableMixin],

	propTypes: {
		groups: React.PropTypes.object
	},

	render: function() {

		var tabs = Object.keys(this.props.groups||{}).sort().map(groupName => {
			var href = ['', groupName, ''].join('/');
			return <ActiveLink href={href} key={href} className="item"><label>{groupName}</label></ActiveLink>;
		});

		var cssClass = ['icon-bar', (_numbers[tabs.length]||'unknown').concat('-up')].join(' ');

		return (
			<div className={cssClass}>{tabs}</div>
		);
	}

});
