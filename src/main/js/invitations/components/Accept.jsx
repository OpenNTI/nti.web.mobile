import PropTypes from 'prop-types';
import React from 'react';

import FormErrors from 'forms/components/FormErrors';
import {Loading} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {accept} from '../Api';

import Success from './AcceptSuccess';

let t = scoped('INVITATIONS');

export default class extends React.Component {
	static displayName = 'Invitations:Accept';

	static propTypes = {
		code: PropTypes.string
	};

	state = {
		code: ''
	};

	componentDidMount () {
		this.setUp();
	}

	componentWillReceiveProps (nextProps) {
		this.setUp(nextProps);
	}

	setUp = (props = this.props) => {
		const {code} = props;
		this.setState({
			code
		});
	};

	onChange = (e) => {
		this.setState({
			code: e.target.value
		});
	};

	onSuccess = (instance) => {
		this.setState({
			loading: false,
			success: true,
			instance
		});
	};

	onError = (error) => {
		function getMessage () {
			let message = error.statusText || error.message || 'Unknown Error';
			if(error.code) {
				message = t(error.code, {fallback: message});
			}
			return message;
		}

		this.setState({
			loading: false,
			error: {
				message: getMessage(),
				raw: error
			}
		});
	};

	onSubmit = (e) => {
		e.preventDefault();

		const {code} = this.state;

		this.setState({
			loading: true
		});

		accept(code)
			.then(this.onSuccess)
			.catch(this.onError);
	};

	form = () => {
		const {error, code = ''} = this.state;
		const disabled = code.trim().length === 0;

		return (
			<div>
				<form onSubmit={this.onSubmit} className="invitation-accept-form">
					<input onChange={this.onChange} value={code} placeholder={t('acceptInputPlaceholder')} />
					<div className="button-row">
						<input type="submit"
							key="submit"
							disabled={disabled}
							id="redeem-submit"
							className="button tiny"
							value={t('acceptButton')} />
					</div>
				</form>
				{error && <FormErrors errors={{'code': error}} />}
			</div>
		);
	};

	render () {

		const {loading, success, instance} = this.state;

		if (loading) {
			return <Loading.Mask />;
		}

		const heading = success ? t('successMessage') : t('formHeading');

		return (
			<div className="invitation-accept">
				<h3>{heading}</h3>
				{success ? <Success instance={instance} /> : this.form()}
			</div>
		);
	}
}
