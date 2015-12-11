import React from 'react';

import scrollParent from 'scrollparent';

import {getScreenWidth, getScreenHeight} from '../utils/viewport';

const EMPTY = ()=>{};

export default React.createClass({
	displayName: 'ScrollTrigger',

	propTypes: {
		onEnterView: React.PropTypes.func.isRequired,
		children: React.PropTypes.node
	},


	subscribeScroll () {
		const scroller = scrollParent(this.refs.self);
		const unsub = () => (scroller.removeEventListener('scroll', this.onScroll), this.unsubscribeScroll = EMPTY);

		unsub.dom = scroller;

		if (this.unsubscribeScroll) {
			this.unsubscribeScroll();
		}

		scroller.addEventListener('scroll', this.onScroll);

		this.unsubscribeScroll = unsub;
	},


	scrollerChanged () {
		let scroller = scrollParent(this.refs.self);
		return scroller !== (this.unsubscribeScroll || {}).dom;
	},


	componentDidMount () {
		this.subscribeScroll();
		this.checkInView();
	},


	componentDidUpdate () {
		if (this.scrollerChanged()) {
			this.subscribeScroll();
		}


		clearTimeout(this.schedual);
		this.schedual = setTimeout(()=> this.checkInView(true), 17);
	},


	componentWillUnmount () {
		this.unsubscribeScroll();
	},


	inView () {
		return this.isMounted() && isElementInView(this.refs.self);
	},


	onScroll () {
		this.checkInView();
	},


	checkInView (force) {
		const {inView} = this.state || {};
		const newInView = this.inView();

		if (force || (inView !== newInView)) {
			if (newInView) {
				this.onEnterView();
			}
			else {
				this.onLeaveView();
			}
		}
	},

	onLeaveView () {
		this.setState({ inView: false });
	},

	onEnterView () {
		const {props: {onEnterView}} = this;

		if (typeof onEnterView === 'function') {
			onEnterView();
		}

		this.setState({ inView: true });
	},

	render () {
		return (
			<div className="scrollTrigger" ref="self" {...this.props}/>
		);
	}
});

function isElementInView (el) {
	let scroller = window;
	try {
		scroller = scrollParent(el);
	} catch (e) {
		debugger;
	}
	const rect = el.getBoundingClientRect();
	const {top, left} = scroller.getBoundingClientRect ? scroller.getBoundingClientRect() : {top: 0, left: 0};

	const viewportY = top;
	const viewportX = left;
	const viewportHeight = scroller.clientHeight || getScreenHeight();
	const viewportWidth = scroller.clientWidth || getScreenWidth();

	return (
		rect.top >= viewportY &&
		rect.left >= viewportX &&
		Math.floor(rect.bottom) <= viewportHeight &&
		Math.floor(rect.right) <= viewportWidth
    );
}
