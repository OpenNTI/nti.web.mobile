import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-component';
import cx from 'classnames';
import {Loading} from '@nti/web-commons';
import {getServer} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

const t = scoped('app.login.forgot');

export default class PasswordResetForm extends React.Component {

	static propTypes = {
		username: PropTypes.string,
		token: PropTypes.string
	}

	state = {}

	attachFormRef = el => this.form = el

	onInput = () => {
		let {valid} = this.state;
		let fields = this.getFieldValues();
		let submitEnabled = Object.values(fields).every(x => x && x.trim().length > 0);

		if (valid === false) {
			let {password, password2} = fields;
			valid = password === password2;
		}

		this.setState({submitEnabled, valid});
	}

	getFieldValues = () => {
		let {password, password2} = (this.form || {}).elements || {};

		let fields = {password, password2};

		for (let key of Object.keys(fields)) {
			fields[key] = fields[key].value;
		}

		return fields;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		let {password, password2} = this.getFieldValues();

		this.setState({error: null, busy: true}, () => {

			if (password !== password2) {
				this.setState({valid: false, busy: false});
				return;
			}


			let {username, token} = this.props;
			getServer().resetPassword(username, password, token)
				.then(() => this.setState({success: true}))
				.catch(x => {
					let error = t(x.code, {fallback: x.message});
					this.setState({error});
				})
				.then(() => this.setState({busy: false}));
		});
	}

	render () {
		const {busy, submitEnabled, success, error, valid = true} = this.state;

		return (
			<div className="login-wrapper">
				<form ref={this.attachFormRef} className={cx('login-form', {'remove-animation': success})} onSubmit={this.handleSubmit}>
					<div className="header">next thought</div>
					{!busy && !success && (
						<div>
							{!!error && <div className="error">{error}</div>}
							{!error && <div className="message recover green">Create your new password.</div>}
						</div>
					)}

					{!!success && !busy && (
						<fieldset className="success">
							Your password has been reset.
							<Link id="login:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
						</fieldset>
					)}

					{busy && <Loading.Mask />}

					{!success && !busy && (
						<fieldset>
							<div className="field-container">
								<input type="password" name="password" placeholder="New Password"
									onChange={this.onInput} />
							</div>
							<div className="field-container">
								<input type="password" name="password2" placeholder="Verify Password"
									onChange={this.onInput} className={cx({error: !valid})} />
								{!valid &&
									<small className="error">Passwords do not match.</small>
								}
							</div>
							<div className="submit-row">
								<button type="submit" disabled={!submitEnabled}>
									{t('RESET_PW', {fallback: 'Reset Password'})}
								</button>
							</div>
							<Link id="login:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
						</fieldset>
					)}
				</form>
			</div>
		);
	}
}
