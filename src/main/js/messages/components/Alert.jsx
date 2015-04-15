

var React = require('react');

var Alert = React.createClass({

	_dismiss: function() {
		if(typeof this.props.dismiss === "function") {
			this.props.dismiss(this);
		}
	},

	render: function() {
		return (
			<div
				id="mainAlert1"
				data-alert
				className="alert-box radius"
				tabIndex="0"
				aria-live="assertive"
				role="dialogalert">

				<span>{this.props.message.message}</span>

				<button
					href="#"
					tabIndex="0"
					className="close"
					aria-label="Close Alert"
					onClick={this._dismiss}>&times;</button>
			</div>
		);
	}
});

module.exports = Alert;
