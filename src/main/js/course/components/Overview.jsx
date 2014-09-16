/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Loading = require('../../common/components/Loading');

var Actions = require('../Actions');
var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'CourseOverview',

	propTypes: {
		course: React.PropTypes.object.isRequired,
		outlineId: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.outlineId !== this.props.outlineId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		this.setState({loading: true});
	},


	// _onChange: function() {
	// 	this.setState({loading: false});
	// },

	render: function() {

		if (this.state.loading) {
			return (<Loading/>);
		}

		return (
			<div/>
		);
	}
});
