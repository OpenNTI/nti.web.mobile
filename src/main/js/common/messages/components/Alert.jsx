/**
 * @jsx React.DOM
 */

var React = require('react');

// can't unmount ourselves.
// function _dismiss(component) {
// 	React.unmountComponentAtNode(component.getDOMNode());
// }

var Alert = React.createClass({

	_click: function(evt) {
		debugger;
		console.log('cleeeek.');
		// _dismiss(this);
		return false;
	},

	render: function() {
		return (
			<div id="mainAlert1" data-alert className="alert-box radius" tabIndex="0" aria-live="assertive" role="dialogalert">
				<span>{this.props.message.message}</span>
				<button href="#" tabIndex="0" className="close" aria-label="Close Alert" onClick={this._click}>&times;</button>
			</div>
		);
	}
});

module.exports = Alert;
