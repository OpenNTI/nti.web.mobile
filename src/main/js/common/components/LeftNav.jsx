/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var LogoutButton = require('login/components/LogoutButton');

var NavDrawerItem = require('navigation/components/NavDrawerItem');
var Loading = require('common/components/Loading');

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

		var child = this.props.isLoading ? <Loading /> : <NavDrawerItem record={record} basePath={basePath}/>;

		return (
			<div>
				<ul className="off-canvas-list">
					<li><a href={basePath}>Home</a></li>
					{child}
				</ul>
				<div className="text-center logout"><LogoutButton /></div>
			</div>
		);
	}
});
