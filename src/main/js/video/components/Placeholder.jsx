import React from 'react';

import Video from './Video';

export default React.createClass({
	displayName: 'VideoPlaceholder',

	getInitialState () {
		return {};
	},

	onClick () {
		this.setState({play: true});
	},

	render () {
		const {state: {play}} = this;
		return play ? (
			<Video {...this.props}/>
		) : (
			<div className="video-placeholder" onClick={this.onClick}/>
		);
	}
});
