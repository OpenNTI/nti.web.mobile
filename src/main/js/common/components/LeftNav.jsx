/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var LogoutButton = require('login/components/LogoutButton');

var NavDrawerItem = require('navigation/components/NavDrawerItem');
var Loading = require('./Loading');
var HomeLink = require('./HomeLink');

module.exports = React.createClass({
	displayName: 'LeftNav',
	propTypes: {
		basePath: React.PropTypes.string.isRequired,
		items: React.PropTypes.array.isRequired
	},


	getDefaultProps: function() {
		return {
			items: [],
			isLoading: false
		};
	},


	getInitialState: function() {
		return {
			//FIXME: Re-write this:
			// http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
			index: this.props.items.length - 1
		};
	},


	componentWillReceiveProps: function(nextProps) {
		if(nextProps.items !== this.props.items) {
			this.setState({index: nextProps.items.length - 1});
		}
	},


	render: function() {

		var basePath = this.props.basePath;
		var record = this.props.items[this.state.index];

		var child = this.props.isLoading ? <Loading /> : (record ? <NavDrawerItem record={record} basePath={basePath}/> : null);

		return (
			<div>
				<ul className="off-canvas-list">
					<li><HomeLink basePath={basePath} /></li>
					{child}
				</ul>
				<div className="text-center logout"><LogoutButton /></div>
			</div>
		);
	}
});
