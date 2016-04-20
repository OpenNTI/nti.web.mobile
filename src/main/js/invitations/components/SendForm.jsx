import React from 'react';
import isEmail from 'nti-lib-interfaces/lib/utils/isemail';

import Loading from 'common/components/Loading';
import Notice from 'common/components/Notice';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';

import {scoped} from 'common/locale';

import {send} from '../Api';

const t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:SendForm',

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			name: '',
			email: '',
			success: false
		};
	},

	onSuccess (result) {
		this.setState({
			name: '',
			email: '',
			loading: false,
			success: true,
			result
		});
	},

	onError (error) {
		this.setState({
			loading: false,
			error: {
				message: error.statusText || error.message || 'Unknown Error'
			}
		});
	},

	onSubmit (e) {
		e.preventDefault();
		const {name, email} = this.state;
		const {course} = this.props;
		this.setState({
			loading: true
		});
		send(course, name, email)
			.then(this.onSuccess)
			.catch(this.onError);
	},

	onNameChange (e) {
		this.setState({
			name: e.target.value
		});
	},

	onEmailChange (e) {
		this.setState({
			email: e.target.value
		});
	},

	validate () {
		const {name, email} = this.state;
		return name.trim().length > 0 && isEmail(email);
	},

	form () {
		const {error} = this.state;
		const heading = t('sendHeading');
		const disabled = !this.validate();

		return (
			<FormPanel title={heading} onSubmit={this.onSubmit}>
				<input className="required" required
					onChange={this.onNameChange}
					value={this.state.name}
					placeholder={t('sendNamePlaceholder')} />
				<input className="required" required
					type="email"
					value={this.state.email}
					onChange={this.onEmailChange}
					placeholder={t('sendEmailPlaceholder')} />
				{error && <FormErrors errors={{'code': error}} />}
				<div className="button-row">
					<input type="submit"
						key="submit"
						disabled={disabled}
						id="redeem:submit"
						className="button"
						value={t('sendButton')} />
				</div>
			</FormPanel>
		);
	},

	reset () {
		this.setState(this.getInitialState());
	},

	successMessage () {
		return (
			<div className="success">
				<Notice>{t('sendSuccessMessage')}</Notice>
				<div className="button-row">
					<button onClick={this.reset}>Send Another</button>
				</div>
			</div>
		);
	},

	render () {

		const {loading, success} = this.state;

		if (loading) {
			return <Loading />;
		}

		return success ? this.successMessage() : this.form();
	}
});
