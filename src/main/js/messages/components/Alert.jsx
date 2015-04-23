import React from 'react';

export default React.createClass({
	displayName: 'Alert',

	propTypes: {
		dismiss: React.PropTypes.func,
		message: React.PropTypes.object
	},

	dismiss () {
		let {dismiss} = this.props;
		if(typeof dismiss === 'function') {
			dismiss(this);
		}
	},

	render () {
		let {message} = this.props;
		return (
			<div
				id="mainAlert1"
				data-alert
				className="alert-box radius"
				tabIndex="0"
				aria-live="assertive"
				role="dialogalert">

				<span>{message.message}</span>

				<button
					href="#"
					tabIndex="0"
					className="close"
					aria-label="Close Alert"
					onClick={this.dismiss}>&times;</button>
			</div>
		);
	}
});
