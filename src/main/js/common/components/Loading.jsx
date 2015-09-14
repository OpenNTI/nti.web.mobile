import React from 'react';
import isEmpty from 'fbjs/lib/isEmpty';

export default React.createClass({
	displayName: 'Loading',

	propTypes: {
		maskScreen: React.PropTypes.bool,
		loading: React.PropTypes.bool,
		message: React.PropTypes.string,
		tag: React.PropTypes.string,

		children: React.PropTypes.any
	},


	getDefaultProps () {
		return {
			tag: 'div',
			message: 'Loading'
		};
	},


	render () {
		let Tag = this.props.tag;
		if (!isEmpty(this.props.children) && !this.props.loading) {
			return <Tag {...this.props}/>;
		}

		if (this.props.maskScreen) {
			return (
				<div className="mask-loader">
					{this.renderSpiner()}
				</div>
			);
		}

		return this.renderSpiner();
	},


	renderSpiner () {
		return (
			<figure className="loading">
				<div className="m spinner"></div>
				<figcaption>{this.props.message}</figcaption>
			</figure>
		);
	}
});
