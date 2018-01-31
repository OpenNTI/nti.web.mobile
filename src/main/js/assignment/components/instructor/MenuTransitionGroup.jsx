import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup, CSSTransition} from 'react-transition-group';


MenuTransitionGroup.propTypes = {
	children: PropTypes.node
};

export default function MenuTransitionGroup (props) {
	const [child] = React.Children.toArray(props.children);

	return (
		<TransitionGroup>
			{child && (
				<CSSTransition
					appear
					classNames="fade-out-in"
					key={child.key}
					timeout={500}
					{...props}
				/>
			)}
		</TransitionGroup>
	);
}
