import React from 'react';
import {Link} from 'react-router-component';

import Conditional from 'common/components/Conditional';

import {scoped} from 'common/locale';

import {recoverPassword, recoverUsername} from '../Actions';

const t = scoped('LOGIN.forgot');


export default React.createClass({
	displayName: 'ForgotForm',

	propTypes: {
		param: React.PropTypes.string
	},


	getFieldValues () {
		let {email, username} = (React.findDOMNode(this.refs.form) || {}).elements || {};

		let fields = {email};

		if (username) {
			Object.assign(fields, {username});
		}

		for (let key of Object.keys(fields)) {
			fields[key] = fields[key].value;
		}

		return fields;
	},


	handleSubmit (e) {
		e.preventDefault();
		e.stopPropagation();

		let action = this.props.param === 'password' ? recoverPassword : recoverUsername;

		let {email, username} = this.getFieldValues();

		this.setState({busy: true, success: void 0, error: void 0 }, () => {

			action(email, username)
				.then(() => {
					this.setState({error: void 0, success: 'Check your email for recovery instructions.'});
				})
				.catch(x => {
					let error = t(x.code, {fallback: x.message});
					this.setState({error});
				})
				.then(()=> this.setState({busy: false}));
		});
	},


	onInput () {
		let fields = this.getFieldValues();
		let submitEnabled = Object.values(fields).every(x => x && x.trim().length > 0);
		this.setState({submitEnabled});
	},


	render () {
		let {param} = this.props;
		let {submitEnabled, error, success} = this.state || {};
		let buttonLabel = t(param === 'password' ? 'recoverpassword' : 'recoverusername');

		return (
			<div className="login-wrapper">
				<form ref="form" className="login-form no-zoom" onSubmit={this.handleSubmit}>
					<div className="header">next thought</div>
					<Conditional condition={!!error} className="message">{error}</Conditional>

					<Conditional condition={!!success} tag="fieldset" className="success">
						{success}
						<Link id="login:forgot:return" href="/" className="fi-arrow-left return-link"> Return to Login</Link>
					</Conditional>
					<Conditional condition={!success} tag="fieldset">

						<Conditional condition={param === 'password'} className="field-container">
							<input type="text" name="username" placeholder="Username"
								onChange={this.onInput} />
						</Conditional>

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
					</Conditional>
				</form>

			</div>
		);
	}
});
