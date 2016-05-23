import React from 'react';

import scrollParent from 'scrollparent';

import {getScreenWidth, getScreenHeight} from 'nti-lib-dom';

const EMPTY = ()=>{};

const shouldBeWindow = el => el.tagName === 'BODY' && el.clientHeight <= el.scrollHeight;
const getScrollParent = el => (x => shouldBeWindow(x) ? global : x)(scrollParent(el));

export default React.createClass({
	displayName: 'ScrollTrigger',

	propTypes: {
		onEnterView: React.PropTypes.func.isRequired,
		children: React.PropTypes.node
	},


	subscribeScroll () {
		const scroller = getScrollParent(this.el);
		const unsub = () => (scroller.removeEventListener('scroll', this.onScroll), this.unsubscribeScroll = EMPTY);
		unsub.dom = scroller;

		if (this.unsubscribeScroll) {
			this.unsubscribeScroll();
		}

		scroller.addEventListener('scroll', this.onScroll);

		this.unsubscribeScroll = unsub;
	},


	scrollerChanged () {
		const scroller = getScrollParent(this.el);
		return scroller !== (this.unsubscribeScroll || {}).dom;
	},


	componentDidMount () {
		this.subscribeScroll();
		this.scheduleCheck(true);
	},


	componentDidUpdate () {
		if (this.scrollerChanged()) {
			this.subscribeScroll();
		}


		this.scheduleCheck();
	},


	componentWillUnmount () {
		this.unsubscribeScroll();
	},


	scheduleCheck (force) {
		clearTimeout(this.schedule);
		this.schedule = setTimeout(()=> this.checkInView(force), 20);
	},


	inView () {
		return isElementInView(this.el);
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
			<div className="scrollTrigger" ref={x => this.el = x} {...this.props}/>
		);
	}
});

function isElementInView (el) {
	const rect = el.getBoundingClientRect();
	const scroller = getScrollParent(el);
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
