import React from 'react';
import Logger from 'nti-util-logger';

import {rawContent} from '../utils/jsx';

const logger = Logger.get('common:components:Error');

const isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

export default React.createClass({
	displayName: 'Error',

	propTypes: {
		error: React.PropTypes.any
	},

	componentDidMount () {
		this.log();
	},


	componentWillReceiveProps (props) {
		if (this.props.error !== props.error) {
			this.log(props);
		}
	},


	log (props = this.props) {
		let {error} = props;
		logger.error(error.stack
					|| error.message
					|| error.responseText
					|| error);
	},



	isAccessError (props = this.props) {
		let {error} = props;
		if (error.statusCode != null) {
			let code = parseInt(error.statusCode, 10);//just a precaution, should already be an int.
			return (code > 400 && code < 404);
		}

		return false;
	},


	render () {
		let {error} = this.props;
		let label = 'Error';
		let message = error.stack || error.message || error.responseText || error || '';

		if (isHTML.test(message)) {
			message = (
				<pre {...rawContent(message)}/>
			);
		}

		if (this.isAccessError()) {
			label = 'Access was denied.';
			message = 'We\'re sorry, but you do not have access to this content.';
		}

		return (
			<figure className="error">
				<div className="m glyph icon-alert"></div>
				<figcaption>
					<span>{label}</span>
					<div>{message}</div>
				</figcaption>
			</figure>
		);
	}
});
