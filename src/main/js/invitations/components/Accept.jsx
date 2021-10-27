import React from 'react';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import FormErrors from 'internal/forms/components/FormErrors';
import { Button, Input } from '@nti/web-core';

import { accept } from '../Api';

import Success from './AcceptSuccess';

const t = scoped('invitations.accept', {
	AlreadyEnrolledException: 'You’re already enrolled.',
	button: 'Accept',
	title: 'Accept Invitation',
	placeholder: 'Enter invitation code',

	successMessage: 'Enrollment Complete',
});

export default class extends React.Component {
	static displayName = 'Invitations:Accept';

	static propTypes = {
		code: PropTypes.string,
	};

	state = {
		code: '',
	};

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		const { code } = this.props;
		if (code !== prevProps.code) {
			this.setup();
		}
	}

	setup = (props = this.props) => {
		const { code } = props;
		this.setState({
			code,
		});
	};

	onChange = e => {
		this.setState({
			code: e,
		});
	};

	onSuccess = instance => {
		this.setState({
			loading: false,
			success: true,
			instance,
		});
	};

	onError = error => {
		function getMessage() {
			let message = error.statusText || error.message || 'Unknown Error';
			if (error.code) {
				message = t(error.code, { fallback: message });
			}
			return message;
		}

		this.setState({
			loading: false,
			error: {
				message: getMessage(),
				raw: error,
			},
		});
	};

	onSubmit = e => {
		e.preventDefault();

		const { code } = this.state;

		this.setState({
			loading: true,
		});

		accept(code).then(this.onSuccess).catch(this.onError);
	};

	form = () => {
		const { error, code = '' } = this.state;
		const disabled = code.trim().length === 0;

		return (
			<div>
				<form
					onSubmit={this.onSubmit}
					css={css`
						display: flex;
						align-items: baseline;
					`}
				>
					<Input.Text
						onChange={this.onChange}
						value={code}
						placeholder={t('placeholder')}
					/>

					<div className="button-row">
						<Button type="submit" disabled={disabled}>
							{t('button')}
						</Button>
					</div>
				</form>
				{error && <FormErrors errors={{ code: error }} />}
			</div>
		);
	};

	render() {
		const { loading, success, instance } = this.state;

		if (loading) {
			return <Loading.Mask />;
		}

		const heading = success ? t('successMessage') : t('title');

		return (
			<div
				css={css`
					padding: 0;
					margin: 0.625rem;
				`}
			>
				<h3>{heading}</h3>
				{success ? <Success instance={instance} /> : this.form()}
			</div>
		);
	}
}
