import React from 'react';

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

		if (this.state.loading) {
			return (<div className="agreement-wrapper"><Loading /></div>);
		}

		if (this.state.error) {
			return (<div className="agreement-wrapper"><ErrorWidget error={this.state.error} /></div>);
		}

		return (
				<div className="agreement-wrapper"><div className="agreement"
					dangerouslySetInnerHTML={{__html: this.state.content || ''}} /></div>
				// <iframe
				// 	className="agreement"

				// 	src={this.state.url}
				// ></iframe>
		);
	}

});
