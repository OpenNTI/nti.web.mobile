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
		if (!this.props.onChange) {
			return;
		}
		let {searchTimeout} = this.state;
		let {delayMs} = this.props;
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		searchTimeout = setTimeout(this.props.onChange.bind(undefined, e), delayMs);
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
