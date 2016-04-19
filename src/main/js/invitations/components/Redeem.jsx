import React from 'react';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';
import Loading from 'common/components/Loading';
import {scoped} from 'common/locale';

import {redeem} from '../Api';

import Success from './Success';

let t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'Invitations:Redeem',

	mixins: [BasePathAware, ContextSender],

	propTypes: {
		code: React.PropTypes.string
	},

	getInitialState () {
		return {
			code: ''
		};
	},

	getContext () {
		const path = this.getBasePath();
		const href = '/redeem/';
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href,
				label: t('title')
			}
		]);
	},

	componentDidMount () {
		this.setUp();
	},

	componentWillReceiveProps (nextProps) {
		this.setUp(nextProps);
	},

	setUp (props = this.props) {
		const {code} = props;
		this.setState({
			code
		});
	},

	onChange (e) {
		this.setState({
			code: e.target.value
		});
	},

	onSuccess (instance) {
		this.setState({
			loading: false,
			success: true,
			instance
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

		const {code} = this.state;

		this.setState({
			loading: true
		});

		redeem(code)
			.then(this.onSuccess)
			.catch(this.onError);
	},

	form () {
		const {error, code = ''} = this.state;
		const disabled = code.trim().length === 0;

		return (
			<div>
				<input onChange={this.onChange} value={code} placeholder={t('redeemInputPlaceholder')} />
				{error && <FormErrors errors={{'code': error}} />}
				<div className="button-row">
					<input type="submit"
						key="submit"
						disabled={disabled}
						id="redeem:submit"
						className="button"
						value={t('redeemButton')} />
				</div>
			</div>
		);
	},

	render () {

		const {loading, success, instance} = this.state;

		if (loading) {
			return <Loading/>;
		}

		const heading = success ? t('successMessage') : t('formHeading');

		return (
			<FormPanel title={heading} onSubmit={this.onSubmit}>
				{success ? <Success instance={instance} /> : this.form()}
			</FormPanel>
		);
	}
});
