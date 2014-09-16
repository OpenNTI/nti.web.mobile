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
		entry: React.PropTypes.string.isRequired
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
		if (nextProps.entry !== this.props.entry) {
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
			return (<div>{this.props.entry}
				<Loading/></div>);
		}

		return (
			<div/>
		);
	}
});
