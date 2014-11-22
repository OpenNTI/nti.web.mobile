/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.RECIPIENT');
var toArray = require('dataserverinterface/utils/toarray');

var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'Recipient',

	getInitialState: function() {
		return {
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
		if (prevState) {
			this.setState(Object.assign({enabled: true},prevState));
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
		}

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
						<div className="line">
							<input type="text" name="toFirstName" placeholder={_t("firstName")}
								onFocus={this._onFocused} defaultValue={this.state.toFirstName} />
							<input type="text" name="toLastName" placeholder={_t("lastName")}
								onFocus={this._onFocused} defaultValue={this.state.toLastName} />
							<input type="email" name="receiver" placeholder={_t("email")}
							 	onFocus={this._onFocused}
								defaultValue={this.state.receiver}
							 	ref="email" className={requiredIfEnabled} />
						</div>
						<textarea name="message" placeholder={_t("message")}
							onFocus={this._onFocused}
							defaultValue={this.state.message}/>
					</fieldset>
					<fieldset>
						<label htmlFor="sender">{_t("fromLabel")}</label>
						<div className="line">
							<input type="text" id="sender" name="sender" defaultValue={this.state.sender}
								placeholder={_t("from")} onFocus={this._onFocused}/>
							<div className="box">{_t("sendDate")}</div>
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
});
