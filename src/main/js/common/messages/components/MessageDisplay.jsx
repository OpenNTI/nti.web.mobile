/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var messages = require('../');
var MessageStore = messages.Store;
var MessageActions = messages.Actions;
var Alert = require('./Alert');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MessageDisplay = React.createClass({

	_updateMessages: function() {
		if (this.isMounted()) {
			var options = this.props.category ? {category: this.props.category} : null;
			this.setState({messages: MessageStore.messages(options)});
		}
		//else {
			// how can this be?
		//}
	},

	componentWillMount: function() {
		MessageStore.addChangeListener(this._updateMessages);
	},

	componentDidUnmount: function() {
		MessageStore.removeChangeListener(this._updateMessages);
	},

	getInitialState: function() {
		var options = this.props.category ? {category: this.props.category} : null;
		return {
			messages: MessageStore.messages(options)
		};
	},

	_dismiss: function(component) {
		MessageActions.removeMessage(component.props.message.id);
	},

	render: function() {
		if (this.state.messages.length === 0) {
			return (<div />);
		}
		var dismiss = this._dismiss;
		var msgs = this.state.messages.map(function(e) {
			return (
				<Alert key={'m' + e.id} message={e} dismiss={dismiss} />
			);
		});
		return (
			<ReactCSSTransitionGroup transitionName="messages">{msgs}</ReactCSSTransitionGroup>
		);
	}

});

module.exports = MessageDisplay;
