import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {validate as isEmail} from 'email-validator';

import Store from '../Store';

const t = scoped('ENROLLMENT.GIFT.RECIPIENT');
const t2 = scoped('ENROLLMENT');

export default class Recipient extends React.Component {

	state = {
		valid: true,
		enabled: false,
		message: null,
		receiver: null,
		sender: null,
		toFirstName: null,
		toLastName: null
	};

	attachFormRef = x => this.elements.form = x
	attachEmailRef = x => this.elements.email = x

	componentWillMount () {
		this.elements = {};

		const prevState = Store.getGiftInfo();

		if (prevState) {
			let [toFirstName = '', toLastName = ''] = (prevState.to || '').split(' ');
			Object.assign(prevState, {
				toFirstName,
				toLastName
			});


			let enabled = ['toFirstName', 'toLastName', 'receiver', 'message', 'sender']
				.some(key => (prevState[key] || '').trim().length > 0);

			this.setState(Object.assign({enabled}, prevState));
		}
	}

	getData = () => {
		const {state: {enabled}, elements: {form}} = this;
		const elements = Array.from(form.elements) || [];
		let result = {};

		if (!enabled) {
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
	};

	isEmpty = () => {
		const {elements: {email: {value = ''} = {}}} = this;
		return value.trim().length === 0;
	};

	validate = () => {
		const {state: {enabled}, elements: {email: {value = ''} = {}}} = this;
		const valid = !enabled || isEmail(value);

		this.setState({valid});

		return valid;
	};

	clearError = () => {
		this.setState({valid: true}); //clear the error
	};

	fieldClicked = () => {
		this.enable();
	};

	fieldChanged = (event) => {
		this.enable();
		this.updateState(event);
	};

	enable = () => {
		this.setState({ enabled: true });
	};

	onCheckedChange = (e) => {
		const {target: {checked: enabled}} = e;
		this.setState({ enabled });
	};

	updateState = (e) => {
		let input = e.target;
		let state = {};

		state[input.name] = input.value;

		this.setState(state);
	};

	render () {
		const {state: {enabled, valid, toFirstName, toLastName, receiver, message, sender}} = this;

		const css = cx('gift-info', {disabled: !enabled});

		const requiredIfEnabled = cx({
			required: enabled,
			error: !valid
		});

		return (
			<div className={css}>
				<form ref={this.attachFormRef} className="">
					<fieldset className="recipient-info">
						<label>
							<input name="enable_recipient"
								type="checkbox"
								checked={enabled}
								onChange={this.onCheckedChange}
							/>
							<span>{t('enable')}</span>
						</label>
						<div className="line">
							<input name="toFirstName"
								placeholder={t('firstName')}
								onClick={this.fieldClicked}
								onChange={this.fieldChanged}
								value={toFirstName}
								type="text"
							/>
							<input name="toLastName"
								placeholder={t('lastName')}
								onClick={this.fieldClicked}
								onChange={this.fieldChanged}
								value={toLastName}
								type="text"
							/>
							<span>
								<input name="receiver"
									placeholder={t('email')}
									onClick={this.fieldClicked}
									onFocus={this.clearError}
									onChange={this.fieldChanged}
									className={requiredIfEnabled}
									value={receiver}
									type="email"
									ref={this.attachEmailRef}
								/>
								{!valid && (
									<span className="error message">
										{this.isEmpty() ? t2('requiredField') : t2('invalidRecipient')}
									</span>
								)}
							</span>
						</div>
						<textarea name="message"
							placeholder={t('message')}
							onClick={this.fieldClicked}
							onChange={this.fieldChanged}
							value={message}
						/>
					</fieldset>
					<fieldset>
						<label htmlFor="sender">{t('fromLabel')}</label>
						<div className="line">
							<input type="text" id="sender" name="sender" onChange={this.fieldChanged} value={sender}
								placeholder={t('from')} />
							<div className="box">{t('sendDate')}</div>
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
}
