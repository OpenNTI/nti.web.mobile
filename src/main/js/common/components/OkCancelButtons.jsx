/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('BUTTONS');

var OkCancelButtons = React.createClass({

	propTypes: {
		onCancel: React.PropTypes.func.isRequired,
		onOk: React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<ul className="button-group even-2 radius">
			  <li>
			  	<a href="#"
					onClick={this.props.onCancel}
			  		className="button tiny secondary">{this.props.cancelText||t('cancel')}</a>
			  </li>
			  <li>
			  	<a href="#"
					onClick={this.props.onOk}
					className="button tiny">{this.props.okText||t('OK')}</a></li>
			</ul>
		);
	}

});

module.exports = OkCancelButtons;
