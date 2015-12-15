import React from 'react';

export default React.createClass({
	displayName: 'BufferedInput',

	propTypes: {
		onChange: React.PropTypes.func,
		delayMs: React.PropTypes.number
	},

	getDefaultProps () {
		return {
			delayMs: 0
		};
	},

	getInitialState () {
		return {};
	},

	onChange (e) {
		const {onChange} = this.props;
		if (!onChange) {
			return;
		}
		let {searchTimeout} = this.state;
		let {delayMs} = this.props;
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = setTimeout(function () {onChange(e);}, delayMs);
		this.setState({
			searchTimeout
		});
	},

	render () {
		return (
			<input {...this.props} onChange={this.onChange}/>
		);
	}
});
