import React from 'react';

import {getService} from 'common/utils';

import Conditional from 'common/components/Conditional';
import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';
import BasePath from 'common/mixins/BasePath';


export default React.createClass({
	displayName: 'UserAgreement',

	mixins: [BasePath],

	getInitialState () {
		return {
			loading: true,
			url: null
		};
	},

	componentDidMount () {
		this.getUserAgreement(this.getBasePath())
			.then(this.setContent, this.setError);
	},


	getUserAgreement (basePath) {
		let url = basePath + 'api/user-agreement/';

		return getService()
			.then(service => service.get(url))
			.catch(reason => {
				if (reason.responseJSON) {
					reason = reason.responseJSON.message;
				}
				return Promise.reject(reason);
			});
	},


	setError  (reason) {
		this.setState({
			error: reason,
			loading: false
		});
	},


	setContent (result) {
		this.setState({
			content: result.body,
			loading: false
		});
	},


	render () {
		let {loading, error, content} = this.state;

		return (
			<div className="agreement-wrapper">

				{ loading ? (
					<Loading />
				) : error ? (
					<ErrorWidget error={error} />
				) : (
					<Conditional condition={!loading && !!content} className="agreement" dangerouslySetInnerHTML={{__html: content}} />
				)}

			</div>
		);
	}

});
