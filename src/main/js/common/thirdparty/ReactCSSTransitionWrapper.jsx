import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

	getInitialState () {
		return {
			mounted: false
		};
	},

	componentDidMount () {
		/* eslint-disable react/no-did-mount-set-state */
		/*
		* Disabling the react/no-set-state lint rule because we want
		* to the children to animate in. So the first render will be without
		* children then this call will trigger a re-render that
		* animates them in.
		*/
		this.setState({
			mounted: true
		});
	},

	render () {
		let {props} = this;
		let children;

		if (!this.props.transitionAppear) {
			children = props.children;
		}
		else {
			if (this.state.mounted) {
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
