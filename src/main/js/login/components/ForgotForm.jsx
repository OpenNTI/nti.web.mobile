import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-component';
import Url from 'url';

import {scoped} from 'nti-lib-locale';

import {getServer} from 'nti-web-client';

const t = scoped('LOGIN.forgot');


export default class extends React.Component {
    static displayName = 'ForgotForm';

    static propTypes = {
		param: PropTypes.string
	};

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

		let action = this.props.param === 'password' ? 'recoverPassword' : 'recoverUsername';

		let {email, username} = this.getFieldValues();

		this.setState({busy: true, success: void 0, error: void 0 }, () => {

			let returnUrl = Url.resolve(document.URL, '/login/passwordrecover.html');

			getServer()[action](email, username, returnUrl)
				.then(() => {
					this.setState({error: void 0, success: 'Check your email for recovery instructions.'});
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

    render() {
		const {param} = this.props;
		const {submitEnabled, error, success} = this.state || {};
		const buttonLabel = t(param === 'password' ? 'recoverpassword' : 'recoverusername');

		return (
			<div className="login-wrapper">
				<form ref={el => this.form = el} className="login-form no-zoom" onSubmit={this.handleSubmit}>
					<div className="header">next thought</div>
					{!!error && <div className="message">{error}</div>}

					{!!success &&
						<fieldset className="success">
							{success}
							<Link id="login:forgot:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
						</fieldset>
					}

					{!success &&
						<fieldset>
							{param === 'password' &&
								<div className="field-container">
									<input type="text" name="username" placeholder="Username"
										onChange={this.onInput} />
								</div>
							}

							<div className="field-container">
								<input type="email" name="email" placeholder="E-mail"
									onChange={this.onInput} />
							</div>

							<div className="submit-row">
								<button id="login:forgot:submit" type="submit" disabled={!submitEnabled} >
									{buttonLabel}
								</button>
							</div>

							<Link id="login:forgot:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
						</fieldset>
					}
				</form>

			</div>
		);
	}
}
