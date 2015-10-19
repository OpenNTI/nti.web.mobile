import React from 'react';
import {Link} from 'react-router-component';
import cx from 'classnames';

import Conditional from 'common/components/Conditional';
import Loading from 'common/components/Loading';

import {getServer} from 'common/utils';
import {scoped} from 'common/locale';

const t = scoped('LOGIN.forgot');

export default React.createClass({

	displayName: 'PasswordResetForm',

	propTypes: {
		username: React.PropTypes.string,
		token: React.PropTypes.string
	},

	getInitialState () {
		return {};
	},


	onInput () {
		let {valid} = this.state;
		let fields = this.getFieldValues();
		let submitEnabled = Object.values(fields).every(x => x && x.trim().length > 0);

		if (valid === false) {
			let {password, password2} = fields;
			valid = password === password2;
		}

		this.setState({submitEnabled, valid});
	},


	getFieldValues () {
		let {password, password2} = (this.refs.form || {}).elements || {};

		let fields = {password, password2};

		for (let key of Object.keys(fields)) {
			fields[key] = fields[key].value;
		}

		return fields;
	},


	handleSubmit (e) {
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
	},


	render () {
		let {busy, submitEnabled, success, error, valid = true} = this.state;

		return (
			<div className="login-wrapper">
				<form ref="form" className={cx('login-form', {'remove-animation': success})} onSubmit={this.handleSubmit}>
					<div className="header">next thought</div>
					<Conditional condition={!busy && !success}>
						<Conditional condition={!!error} className="message">{error}</Conditional>
						<Conditional condition={!error} className="message recover green">Create your new password.</Conditional>
					</Conditional>

					<Conditional condition={!!success && !busy} tag="fieldset" className="success">
						Your password has been reset.
						<Link id="login:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
					</Conditional>

					<Conditional condition={busy}>
						<Loading/>
					</Conditional>

					<Conditional condition={!success && !busy} tag="fieldset">
						<div className="field-container">
							<input type="password" name="password" placeholder="New Password"
								onChange={this.onInput} />
						</div>
						<div className="field-container">
							<input type="password" name="password2" placeholder="Verify Password"
								onChange={this.onInput} className={cx({error: !valid})} />
							<Conditional condition={!valid} tag="small" className="error">
								Passwords do not match.
							</Conditional>
						</div>
						<div className="submit-row">
							<button type="submit" disabled={!submitEnabled}>
								{t('RESET_PW', {fallback: 'Reset Password'})}
							</button>
						</div>
						<Link id="login:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
					</Conditional>
				</form>
			</div>
		);
	}

});
