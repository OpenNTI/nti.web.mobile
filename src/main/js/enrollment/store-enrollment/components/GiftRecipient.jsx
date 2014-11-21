/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.RECIPIENT');
var toArray = require('dataserverinterface/utils/toarray');

module.exports = React.createClass({
	displayName: 'Recipient',

	getInitialState: function() {
		return {
			enabled: false
		};
	},

	validate: function() {
		//do stuff
		//form.elements
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

		if (result.to_first_name) {
			if (result.to_last_name) {
				result.to = result.to_first_name + ' ' + result.to_last_name;
			} else {
				result.to = result.to_first_name;
			}
		} else if (result.to_last_name) {
			result.to = result.to_last_name;
		}

		delete result.to_first_name;
		delete result.to_last_name;

		return result;
	},


	isValid: function() {
		var email = this.refs.email;

		email = email && email.isMounted() && email.getDOMNode();
		email = email && email.value;
		email = email || '';

		return !this.state.enabled || email !== '';
	},


	_onFocused: function() {
		this.setState({
			enabled: true
		});
	},


	_onCheckedChange: function(e) {
		this.setState({
			enabled: e.target.checked
		});
	},


	render: function() {
		var enabled = this.state.enabled;
		var enabledCls = enabled ? '' : 'disabled';
		var requiredIfEnabled = enabled ? 'required' : null;

		return (
			<div className={"gift-info " + enabledCls}>
				<form ref="form" className="">
					<fieldset className="recipient-info">
						<label className="">
							<input type="checkbox" name="enable_recipient" checked={this.state.enabled} onChange={this._onCheckedChange}/>
							{_t("enable")}
						</label>
						<input type="text" name="to_first_name" placeholder={_t("firstName")} onFocus={this._onFocused} />
						<input type="text" name="to_last_name" placeholder={_t("lastName")} onFocus={this._onFocused} />
						<input type="email" ref="email" className={requiredIfEnabled} name="receiver"
								placeholder={_t("email")} onFocus={this._onFocused}/>
						<textarea name="message" placeholder={_t("message")} onFocus={this._onFocused}/>
					</fieldset>
					<fieldset>
						<label htmlFor="sender">{_t("fromLabel")}</label>
						<input type="text" id="sender" name="sender" placeholder={_t("from")} onFocus={this._onFocused}/>
						<span>{_t("sendDate")}</span>
					</fieldset>
				</form>
			</div>
		);
	}
});
