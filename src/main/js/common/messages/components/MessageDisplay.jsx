/**
 * @jsx React.DOM
 */

var React = require('react');
var MessageStore = require('../MessageStore');
var Alert = require('./Alert');

var MessageDisplay = React.createClass({

	_updateMessages: function() {
		this.setState({messages: MessageStore.messages()});
	},

	componentWillMount: function() {
		MessageStore.addChangeListener(this._updateMessages);
	},

	componentDidUnmount: function() {
		MessageStore.removeChangeListener(this._updateMessages);
	},

	getInitialState: function() {
		return {
			messages:[]
		};
	},

	render: function() {
		if(this.state.messages.length == 0) {
			return (<div />);
		}
		var msgs = this.state.messages.map(function(e,idx,arr) {
			return (
				<Alert key={'m' + e.id} message={e} />
			);
		})
		return (
			<div>{msgs}</div>
		);
	}

});

module.exports = MessageDisplay;
