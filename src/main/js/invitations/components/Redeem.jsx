import React from 'react';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import FormPanel from 'common/forms/components/FormPanel';
import FormErrors from 'common/forms/components/FormErrors';
import Loading from 'common/components/Loading';

import {redeem} from '../Api';

import Success from './Success';

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
				label: 'Invitation'
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

	onSuccess () {
		this.setState({
			loading: false,
			success: true
		});
	},

	onError (error) {
		if ((error.responseText || '').indexOf('already enrolled') > -1) {
			return this.onSuccess();
		}
		this.setState({
			loading: false,
			error
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
		const {error, code} = this.state;
		const disabled = code.trim().length === 0;

		return (
			<div>
				<input onChange={this.onChange} value={code} />
				{error && <FormErrors errors={{'code': error}} />}
				<div className="button-row">
					<input type="submit"
						key="submit"
						disabled={disabled}
						id="redeem:submit"
						className="button"
						value="Redeem" />
				</div>
			</div>
		);
	},

	render () {

		const {loading, success} = this.state;

		if (loading) {
			return <Loading/>;
		}

		return (
			<FormPanel title="Redeem Invitation" onSubmit={this.onSubmit}>
				{success ? <Success /> : this.form()}
			</FormPanel>
		);
	}
});
