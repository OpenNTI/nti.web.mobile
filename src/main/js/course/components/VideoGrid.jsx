/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('common/components/Loading');
var Error = require('common/components/Error');

module.exports = React.createClass({
	displayName: 'VideoGrid',

	getInitialState: function() {
		return {
			loading: true,
			error: false
		};
	},


	componentDidMount: function() {
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {},


	componentWillReceiveProps: function(nextProps) {
		// if (nextProps.course !== this.props.course) {
		// 	this.getDataIfNeeded(nextProps);
		// }
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error
		});
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		try {

		} catch (e) {
			this.__onError(e);
		}
	},


	render: function() {
		return (<Loading/>);
	}
});
