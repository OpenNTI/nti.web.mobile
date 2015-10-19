import React from 'react';
import {scoped} from 'common/locale';
import isEmail from 'nti.lib.interfaces/utils/isemail';

import Store from '../Store';

const t = scoped('ENROLLMENT.GIFT.RECIPIENT');

export default React.createClass({
	displayName: 'Recipient',

	getInitialState () {
		return {
			valid: true,
			enabled: false,
			message: null,
			receiver: null,
			sender: null,
			toFirstName: null,
			toLastName: null
		};
	},


	componentWillMount () {
		let prevState = Store.getGiftInfo();
		let name;

		if (prevState) {
			name = (prevState.to || '').split(' ');
			prevState.toFirstName = name[0] || '';
			prevState.toLastName = name[1] || '';


			let enabled = ['toFirstName', 'toLastName', 'receiver', 'message', 'sender']
				.some(key => (prevState[key] || '').trim().length > 0);

			this.setState(Object.assign({enabled: enabled}, prevState));
		}
	},



	getData () {
		let result = {},
			elements = Array.from(this.refs.form.elements) || [];

		if (!this.state.enabled) {
			return result;
		}

		result = elements.reduce((agg, element) => {
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


	isEmpty () {
		let {email} = this.refs;

		email = email && email.value;
		email = email || '';

		return email.trim().length === 0;
	},


	isValid () {
		let {email} = this.refs;

		email = email && email.value;
		email = email || '';

		let v = !this.state.enabled || isEmail(email);
		this.setState({valid: v});
		return v;
	},


	fieldClicked () {
		this.enable();
	},

	fieldChanged (event) {
		this.enable();
		this.updateState(event);
	},

	enable () {
		this.setState({
			enabled: true
		});
	},

	onCheckedChange (e) {
		this.setState({
			enabled: e.target.checked
		});
	},


	updateState (e) {
		let input = e.target;
		let state = {};

		state[input.name] = input.value;

		this.setState(state);
	},


	render () {
		let enabled = this.state.enabled;
		let enabledCls = enabled ? '' : 'disabled';
		let requiredIfEnabled = enabled ? 'required' : '';

		if (!this.state.valid) {
			requiredIfEnabled += ' error';
		}

		return (
			<div className={'gift-info ' + enabledCls}>
				<form ref="form" className="">
					<fieldset className="recipient-info">
						<label className="">
							<input type="checkbox" name="enable_recipient" checked={this.state.enabled} onChange={this.onCheckedChange}/>
							{t('enable')}
						</label>
						<div className="line">
							<input type="text" name="toFirstName" placeholder={t('firstName')}
								onClick={this.fieldClicked}
								onChange={this.fieldChanged} value={this.state.toFirstName} />
							<input type="text" name="toLastName" placeholder={t('lastName')}
								onClick={this.fieldClicked}
								onChange={this.fieldChanged} value={this.state.toLastName} />
							<input type="email" name="receiver" placeholder={t('email')}
								onClick={this.fieldClicked}
								onChange={this.fieldChanged} value={this.state.receiver}
								ref="email" className={requiredIfEnabled} />
						</div>
						<textarea name="message" placeholder={t('message')}
							onClick={this.fieldClicked}
							onChange={this.fieldChanged} value={this.state.message}/>
					</fieldset>
					<fieldset>
						<label htmlFor="sender">{t('fromLabel')}</label>
						<div className="line">
							<input type="text" id="sender" name="sender" onChange={this.fieldChanged} value={this.state.sender}
								placeholder={t('from')} />
							<div className="box">{t('sendDate')}</div>
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
});
