import React from 'react';

import {getServer} from 'common/utils';
import {rawContent} from 'common/utils/jsx';

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
			.catch(er =>
				Promise.reject(er.responseJSON ? er.responseJSON.message : er));
	},


	setError (error) {
		this.setState({ error, loading: false });
	},


	setContent (result) {
		const {body, styles = ''} = result;

		const alteredStyles = styles
			//do not import other sheets.
			.replace(/@import[^;]*;/g, '')
			//do not allow margin rules:
			.replace(/(margin)([^\:]*):([^;]*);/g, '');

		this.setState({
			styles: alteredStyles,
			content: body,
			loading: false
		});
	},


	render () {
		const {state: {loading, error, content, styles}} = this;

		return (
			<div className="agreement-wrapper">

				{ loading ? (
					<Loading />
				) : error ? (
					<ErrorWidget error={error} />
				) : (
					<Conditional condition={!loading && !!content} className="agreement">
						<style type="text/css" scoped {...rawContent(styles)}/>
						<div {...rawContent(content)}/>
					</Conditional>
				)}

			</div>
		);
	}

});