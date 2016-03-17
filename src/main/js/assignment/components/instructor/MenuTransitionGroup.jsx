import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

export default function MenuTransitionGroup (props) {
	return (
		<TransitionGroup
			transitionName="fadeOutIn"
			transitionAppear
			transitionAppearTimeout={500}
			transitionEnterTimeout={500}
			transitionLeaveTimeout={500}
			{...props}
		/>
	);
}
