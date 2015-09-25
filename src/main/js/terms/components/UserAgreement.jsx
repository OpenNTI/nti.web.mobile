import React from 'react';

import {getServer} from 'common/utils';

import Conditional from 'common/components/Conditional';
import ErrorWidget from 'common/components/Error';
import Loading from 'common/components/Loading';
import BasePath from 'common/mixins/BasePath';


export default React.createClass({
	displayName: 'UserAgreement',

	mixins: [BasePath],

	getInitialState () {
		return {
			loading: true
		};
	},

	componentDidMount () {
		this.getUserAgreement(this.getBasePath())
			.then(this.setContent, this.setError);
	},


	getUserAgreement (basePath) {
		let url = basePath + 'api/user-agreement/';

		return getServer().get(url)
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
		let {styles, body: content} = result;

		styles = styles || '';

		//do not import other sheets.
		styles = styles.replace(/@import[^;]*;/g, '');
		//do not allow margin rules:
		styles = styles.replace(/(margin)([^\:]*):([^;]*);/g, '');

		this.setState({ styles, content, loading: false });
	},


	render () {
		let {loading, error, content, styles} = this.state;

		return (
			<div className="agreement-wrapper">

				{ loading ? (
					<Loading />
				) : error ? (
					<ErrorWidget error={error} />
				) : (
					<Conditional condition={!loading && !!content} className="agreement">
						<style type="text/css" scoped dangerouslySetInnerHTML={{__html: styles}}/>
						<div dangerouslySetInnerHTML={{__html: content}}/>
					</Conditional>
				)}

			</div>
		);
	}

});
