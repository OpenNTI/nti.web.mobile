import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

export default React.createClass({
	displayName: 'MenuTransitionGroup',

	propTypes: {
		children: React.PropTypes.any
	},

	render () {
		return (
			<TransitionGroup
				transitionName="fadeOutIn"
				transitionAppear
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
			>{this.props.children}</TransitionGroup>
		);
	}
});
