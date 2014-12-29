'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Store = require('../Store');
var MessageActions = require('../Actions');

var Alert = require('./Alert');


var MessageDisplay = React.createClass({

	_updateMessages: function() {
		if (this.isMounted()) {
			var options = this.props.category ? {category: this.props.category} : null;
			this.setState({messages: Store.messages(options)});
		}
		//else {
			// how can this be?
			// JSG: This can be if the bound reference was given to an asyncronous function
			// 		as a callback, and it calls back after we've already dismissed.
		//}
	},

	componentWillMount: function() {
		Store.addChangeListener(this._updateMessages);
	},

	componentDidUnmount: function() {
		Store.removeChangeListener(this._updateMessages);
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
		
		var options = this.props.category ? {category: this.props.category} : null;
		return {
			messages: Store.messages(options)
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
