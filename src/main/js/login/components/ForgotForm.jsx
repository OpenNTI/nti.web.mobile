import Url from 'url';

import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-component';
import {scoped} from '@nti/lib-locale';
import {getServer} from '@nti/web-client';
import classnames from 'classnames/bind';

import styles from './ForgotForm.css';

const cx = classnames.bind(styles);
const t = scoped('app.login.forgot');


export default class ForgotForm extends React.Component {

	static propTypes = {
		param: PropTypes.string
	};

	attachFormRef = el => this.form = el

	getFieldValues = () => {
		let {email, username} = (this.form || {}).elements || {};

		let fields = {email};

		if (username) {
			Object.assign(fields, {username});
		}

		for (let key of Object.keys(fields)) {
			fields[key] = fields[key].value.trim();
		}

		return fields;
	};

	handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {param} = this.props;
		let action = param === 'password' ? 'recoverPassword' : 'recoverUsername';
		let message = param === 'password' ? (
			<>We sent a link to<br/>reset your password.</>
		) : (
			<>We sent your username to your email address.</>
		);

		let {email, username} = this.getFieldValues();

		this.setState({busy: true, success: void 0, error: void 0 }, () => {

			let returnUrl = Url.resolve(document.URL, '/login/passwordrecover.html');

			getServer()[action](email, username, returnUrl)
				.then(() => {
					this.setState({error: void 0, success: (
						<>
							<h2>{message}</h2>
							<p>{email}</p>
						</>
					)});
				})
				.catch(x => {
					let error = t(x.code, {fallback: x.message});
					this.setState({error});
				})
				.then(()=> this.setState({busy: false}));
		});
	};

	onInput = () => {
		let fields = this.getFieldValues();
		let submitEnabled = Object.values(fields).every(x => x && x.trim().length > 0);
		this.setState({submitEnabled});
	};

	render () {
		const {param} = this.props;
		const {submitEnabled, error, success} = this.state || {};
		const buttonLabel = t(param === 'password' ? 'recoverpassword' : 'recoverusername');

		return (
			<div className={cx('login-wrapper', 'recovery')}>
				<form ref={this.attachFormRef} className="login-form no-zoom" onSubmit={this.handleSubmit}>
					<fieldset>
						{!!success && (
							<div className={cx('success')}>
								{success}
								<div className={cx('fill')}/>
								<Link id="login:forgot:return" href="/"> Return to Login</Link>
							</div>
						)}

						{!success && (
							<div className={cx('col')}>
								{param === 'password' ? (
									<>
										<h4>Forgot Password?</h4>
										<p>Enter your account information and we’ll help reset your password.</p>
									</>
								) : (
									<>
										<h4>Forgot username?</h4>
										<p>Enter your email and we’ll send your username.</p>
									</>
								)}
								{param === 'password' && (
									<div className="field-container">
										<input type="text" name="username" placeholder="Username"
											onChange={this.onInput} />
									</div>
								)}

								<div className="field-container">
									<input type="email" name="email" placeholder="Email"
										onChange={this.onInput} />
								</div>

								{!!error && <div className="message">{error}</div>}

								<button id="login:forgot:submit" type="submit" disabled={!submitEnabled} >
									{buttonLabel}
								</button>
								<div className={cx('fill')}/>
								<Link id="login:forgot:return" href="/"> Return to Login</Link>
							</div>
						)}
					</fieldset>
				</form>

			</div>
		);
	}
}
