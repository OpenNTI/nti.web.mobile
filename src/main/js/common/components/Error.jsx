import React from 'react';

const isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

export default React.createClass({
	displayName: 'Error',

	propTypes: {
		error: React.PropTypes.any
	},


	componentDidMount () {
		let e = this.props.error;
		console.error(e.stack || e.message || e.responseText || e);
	},


	render () {
		let error = this.props.error;
		let message = error.stack || error.message || error.responseText || error || '';

		if (isHTML.test(message)) {
			message = (
				<pre dangerouslySetInnerHTML={{__html: message}}/>
			);
		}

		return (
			<figure className="error">
				<div className="m glyph fi-alert"></div>
				<figcaption>
					Error
					<div>{message}</div>
				</figcaption>
			</figure>
		);
	}
});
