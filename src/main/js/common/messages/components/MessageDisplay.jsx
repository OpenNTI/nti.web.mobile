/**
 * @jsx React.DOM
 */

var React = require('react');
var messages = require('../');
var MessageStore = messages.Store;
var MessageActions = messages.Actions;
var Alert = require('./Alert');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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

	_dismiss: function(component) {
		MessageActions.removeMessage(component.props.message.id);
	},

	render: function() {
		if(this.state.messages.length == 0) {
			return (<div />);
		}
		var dismiss = this._dismiss;
		var msgs = this.state.messages.map(function(e,idx,arr) {
			return (
				<Alert key={'m' + e.id} message={e} dismiss={dismiss} />
			);
		})
		return (
			<ReactCSSTransitionGroup transitionName="messages">{msgs}</ReactCSSTransitionGroup>
		);
	}

});

module.exports = MessageDisplay;
