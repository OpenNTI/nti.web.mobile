/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.RECIPIENT');
var isEmail = require('dataserverinterface/utils/isemail');
var toArray = require('dataserverinterface/utils/toarray');

var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'Recipient',

	getInitialState: function() {
		return {
			valid: true,
			enabled: false,
			from: null,
			message: null,
			receiver: null,
			sender: null,
			toFirstName: null,
			toLastName: null
		};
	},


	componentDidMount: function() {
		var prevState = Store.getGiftInfo();
		var name;

		if (prevState) {
			name = (prevState.to || '').split(' ');
			prevState.toFirstName = name[0] || '';
			prevState.toLastName = name[1] || '';


			var enabled = ["toFirstName", "toLastName", "receiver", "message", "sender"].some(function(key) {
				return (prevState[key]||'').trim().length > 0;
			});
			this.setState(Object.assign({enabled: enabled},prevState));
		}
	},



	getData: function() {
		var result = {},
			elements = toArray(this.refs.form.getDOMNode().elements) || [];

		if (!this.state.enabled) {
			return result;
		}

		result = elements.reduce(function(agg, element) {
			if (element.name) {
				if (element.type === 'checkbox') {
					agg[element.name] = element.checked;
				} else {
					agg[element.name] = element.value;
				}
			}

			return agg;
		}, {});

		if (result.toFirstName) {
			if (result.toLastName) {
				result.to = result.toFirstName + ' ' + result.toLastName;
			} else {
				result.to = result.toFirstName;
			}
		} else if (result.toLastName) {
			result.to = result.toLastName;
		} else {
			result.to = '';
		}

		return result;
	},


	isEmpty: function() {
		var email = this.refs.email;

		email = email && email.isMounted() && email.getDOMNode();
		email = email && email.value;
		email = email || '';

		return email.trim().length === 0;
	},


	isValid: function() {
		var email = this.refs.email;

		email = email && email.isMounted() && email.getDOMNode();
		email = email && email.value;
		email = email || '';

		var v = !this.state.enabled || isEmail(email);
		this.setState({valid: v});
		return v;
	},


	_fieldClicked: function() {
		this._enable();
	},

	_fieldChanged: function(event) {
		this._enable();
		this._updateState(event);
	},

	_enable: function() {
		this.setState({
			enabled: true
		});
	},

	_onCheckedChange: function(e) {
		this.setState({
			enabled: e.target.checked
		});
	},


	_updateState: function(e) {
		var input = e.target;
		var state = {};

		state[input.name] = input.value;

		this.setState(state);
	},


	render: function() {
		var enabled = this.state.enabled;
		var enabledCls = enabled ? '' : 'disabled';
		var requiredIfEnabled = enabled ? 'required' : '';

		if (!this.state.valid) {
			requiredIfEnabled += ' error';
		}

		return (
			<div className={"gift-info " + enabledCls}>
				<form ref="form" className="">
					<fieldset className="recipient-info">
						<label className="">
							<input type="checkbox" name="enable_recipient" checked={this.state.enabled} onChange={this._onCheckedChange}/>
							{_t("enable")}
						</label>
						<div className="line">
							<input type="text" name="toFirstName" placeholder={_t("firstName")}
								onClick={this._fieldClicked}
								onChange={this._fieldChanged} value={this.state.toFirstName} />
							<input type="text" name="toLastName" placeholder={_t("lastName")}
								onClick={this._fieldClicked}
								onChange={this._fieldChanged} value={this.state.toLastName} />
							<input type="email" name="receiver" placeholder={_t("email")}
							 	onClick={this._fieldClicked}
								onChange={this._fieldChanged} value={this.state.receiver}
							 	ref="email" className={requiredIfEnabled} />
						</div>
						<textarea name="message" placeholder={_t("message")}
							onClick={this._fieldClicked}
							onChange={this._fieldChanged} value={this.state.message}/>
					</fieldset>
					<fieldset>
						<label htmlFor="sender">{_t("fromLabel")}</label>
						<div className="line">
							<input type="text" id="sender" name="sender" onChange={this._fieldChanged} value={this.state.sender}
								placeholder={_t("from")} />
							<div className="box">{_t("sendDate")}</div>
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
});
