import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

/**
	Adapted from https://github.com/jcobb/react-js-transition-wrapper
*/
export default React.createClass({
	displayName: 'ReactCSSTransitionWrapper',

	propTypes: {
		transitionName: React.PropTypes.string.isRequired,
		transitionEnter: React.PropTypes.bool,
		transitionLeave: React.PropTypes.bool,
		transitionAppear: React.PropTypes.bool
	},


	getDefaultProps () {
		return {
			transitionEnter: true,
			transitionLeave: true,
			transitionAppear: true
		};
	},

	componentDidMount () {
		this.forceUpdate();
	},


	render (){
		let {props} = this;
		let children;

		if(!this.props.transitionAppear){
			children = props.children;
		}
		else{
			if(this.isMounted()){
				children = props.children;
			}
		}

		return (
			<ReactCSSTransitionGroup {...props}
				transitionName={props.transitionName}
				transitionEnter={props.transitionEnter}
				transitionLeave={props.transitionLeave}
			>
				{children}
			</ReactCSSTransitionGroup >
		);
	}
});
