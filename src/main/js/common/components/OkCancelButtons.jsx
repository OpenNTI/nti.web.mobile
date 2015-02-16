'use strict';

var React = require('react');
var t = require('common/locale').scoped('BUTTONS');

var OkCancelButtons = React.createClass({

	propTypes: {
		onCancel: React.PropTypes.func.isRequired,
		onOk: React.PropTypes.func.isRequired,
		okEnabled: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			okEnabled: true
		};
	},

	_cancelClick(event) {
		this._killEvent(event);
		this.props.onCancel(event);
	},

	_okClick(event) {
		this._killEvent(event);
		this.props.onOk(event);
	},

	_killEvent: function(event) {
		event.preventDefault();
		event.stopPropagation();
	},

	render: function() {

		return (
			<div className="buttons">
			  	<a href="#"
					onClick={this._cancelClick}
			  		className="cancel button">{this.props.cancelText||t('cancel')}</a>
			  	<a href="#"
					onClick={this.props.okEnabled ? this._okClick : this._killEvent}
					disabled={!this.props.okEnabled}
					className="confirm button">{this.props.okText||t('ok')}</a>
			</div>
		);
	}

});

module.exports = OkCancelButtons;
