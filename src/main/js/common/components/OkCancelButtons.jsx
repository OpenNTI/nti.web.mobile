/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
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
			<ul className="button-group even-2 radius">
			  <li>
			  	<a href="#"
					onClick={this._cancelClick}
			  		className="button tiny secondary">{this.props.cancelText||t('cancel')}</a>
			  </li>
			  <li>
			  	<a href="#"
					onClick={this.props.okEnabled ? this._okClick : this._killEvent}
					disabled={!this.props.okEnabled}
					className="button tiny">{this.props.okText||t('ok')}</a></li>
			</ul>
		);
	}

});

module.exports = OkCancelButtons;
