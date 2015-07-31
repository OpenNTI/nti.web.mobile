import React from 'react';

import Conditional from 'common/components/Conditional';
import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';
import BasePath from 'common/mixins/BasePath';
// import preventOverscroll from 'common/thirdparty/prevent-overscroll';

import Store from '../Store';

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
		Store.getUserAgreement(this.getBasePath())
			.then(this.setContent, this.setError);
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
		// preventOverscroll(React.findDOMNode(this).querySelector('.agreement'));
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
