import './SendForm.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { validate as isEmail } from 'email-validator';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { Button, Input, NoticePanel as Notice } from '@nti/web-core';
import FormPanel from 'internal/forms/components/FormPanel';
import FormErrors from 'internal/forms/components/FormErrors';

import { send, canSend } from '../Api';

const t = scoped('invitations.send', {
	heading: 'Send Invitation',
	button: 'Send',
	namePlaceholder: 'Name',
	emailPlaceholder: 'Email',
	messagePlaceholder: 'Message',
	successMessage: 'Invitation sent.',
	cannotSend: 'Can’t send invitations for this course.',
});

export default createReactClass({
	displayName: 'Invitations:SendForm',

	propTypes: {
		course: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			email: '',
			success: false,
		};
	},

	onSuccess(result) {
		this.setState({
			email: '',
			message: '',
			loading: false,
			success: true,
			result,
		});
	},

	onError(error) {
		this.setState({
			loading: false,
			error: {
				message: error.statusText || error.message || 'Unknown Error',
			},
		});
	},

	onSubmit(e) {
		e.preventDefault();
		const { email, message } = this.state;
		const { course } = this.props;
		this.setState({
			loading: true,
		});
		send(course, email, message).then(this.onSuccess).catch(this.onError);
	},

	onEmailChange(email) {
		this.setState({
			email,
		});
	},

	onMessageChange(e) {
		this.setState({
			message: e.target.value,
		});
	},

	validate() {
		const { email } = this.state;
		return isEmail(email);
	},

	form() {
		const { error } = this.state;
		const heading = t('heading');
		const disabled = !this.validate();

		return (
			<FormPanel
				title={heading}
				onSubmit={this.onSubmit}
				css={css`
					form {
						display: flex;
						flex-flow: column nowrap;
						gap: 1em;

						& > * {
							flex: 1 1 auto;
						}
					}
				`}
			>
				<Input.Text
					className="required"
					required
					type="email"
					value={this.state.email}
					onChange={this.onEmailChange}
					placeholder={t('emailPlaceholder')}
				/>
				<textarea
					name="message"
					placeholder={t('messagePlaceholder')}
					onChange={this.onMessageChange}
					value={this.state.message}
				/>
				{error && <FormErrors errors={{ code: error }} />}
				<div className="button-row">
					<Button type="submit" disabled={disabled}>
						{t('button')}
					</Button>
				</div>
			</FormPanel>
		);
	},

	reset() {
		this.setState(this.getInitialState());
	},

	successMessage() {
		return (
			<div className="success">
				<Notice>{t('successMessage')}</Notice>
				<div className="button-row">
					<Button onClick={this.reset}>Send Another</Button>
				</div>
			</div>
		);
	},

	render() {
		const { course } = this.props;
		const { loading, success } = this.state;

		if (loading) {
			return <Loading.Mask />;
		}

		if (!canSend(course)) {
			return <Notice>{t('cannotSend')}</Notice>;
		}

		return success ? this.successMessage() : this.form();
	},
});
