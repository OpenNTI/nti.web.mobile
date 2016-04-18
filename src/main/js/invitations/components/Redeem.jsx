import React from 'react';

import Loading from 'common/components/Loading';
import Error from 'common/components/Error';
import BasePathAware from 'common/mixins/BasePath';

import {redeem} from '../Api';

export default React.createClass({
	displayName: 'Invitations:Redeem',

	mixins: [BasePathAware],

	propTypes: {
		code: React.PropTypes.string
	},

	getInitialState () {
		return {};
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

	render () {

		const {loading, error, code, success} = this.state;

		if (success) {
			let library = this.getBasePath() + 'library/';
			return <div><a href={library}>Go to my courses</a></div>;
		}

		if (error) {
			return (<Error error={error} />);
		}

		if (loading) {
			return <Loading/>;
		}

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<input onChange={this.onChange} value={code} />
					<button>Redeem</button>
				</form>

			</div>
		);
	}
});
