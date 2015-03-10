import React from 'react';


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

	getInitialState: function() {
		return {mounted: false};
	},

	getDefaultProps: function() {
		return {
			transitionEnter: true,
			transitionLeave: true,
			transitionAppear: true
		};
	},

	componentDidMount: function() {
		this.setState({ mounted: true });
	},

	render: function (){

		var children;

		if(!this.props.transitionAppear){
			children = this.props.children;
		}
		else{
			if(this.state.mounted){
				children = this.props.children;
			}
		}

		return(
			<ReactCSSTransitionGroup {...this.props}
				transitionName={this.props.transitionName}
				transitionEnter={this.props.transitionEnter}
				transitionLeave={this.props.transitionLeave}
			>
				{children}
			</ReactCSSTransitionGroup >
		);
	}

});

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
