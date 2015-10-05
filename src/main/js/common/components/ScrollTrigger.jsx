import React from 'react';

export default React.createClass({
	displayName: 'ScrollTrigger',

	propTypes: {
		onEnterView: React.PropTypes.func,
		children: React.PropTypes.any
	},

	getInitialState () {
		return {};
	},

	inView () {
		return isElementInViewport(React.findDOMNode(this));
	},

	componentDidMount () {
		window.addEventListener('scroll', this.onScroll);
		this.checkInView();
	},

	componentWillUnmount () {
		window.removeEventListener('scroll', this.onScroll);
	},

	onScroll () {
		this.checkInView();
	},

	checkInView (force) {
		let {inView} = this.state;
		let newInView = this.inView();
		if (force || (inView !== newInView)) {
			let handler = newInView ? this.onEnterView : this.onLeaveView;
			handler();
		}
	},

	onLeaveView () {
		console.debug('leave view');
		this.setState({
			inView: false
		});
	},

	onEnterView () {
		console.debug('enter view');
		if (typeof this.props.onEnterView === 'function') {
			this.props.onEnterView();
		}
		this.setState({
			inView: true
		});
	},

	render () {
		return (
			<div className="scrollTrigger">{this.props.children}</div>
		);
	}
});

function isElementInViewport (el) {

	let rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		Math.floor(rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
