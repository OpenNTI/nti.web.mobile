/*
	react-swipe-to-reveal-options looks to be dead.
	We've imported the code here and translated it to ES6.

	TODO: Replace / Remove this component with something better.
 */
import React from 'react';
import PropTypes from 'prop-types';

function translateStyle (x, measure, y) {
	const _y = y || '0';
	const transform = `translate3d(${x}${measure}, ${_y}, 0)`;
	return {
		transform,
		WebkitTransform: transform
	};
}

class Swipeable extends React.Component {
	static propTypes = {
		onSwiped: PropTypes.func,
		onSwipingUp: PropTypes.func,
		onSwipingRight: PropTypes.func,
		onSwipingDown: PropTypes.func,
		onSwipingLeft: PropTypes.func,
		onSwipedUp: PropTypes.func,
		onSwipedRight: PropTypes.func,
		onSwipedDown: PropTypes.func,
		onSwipedLeft: PropTypes.func,
		flickThreshold: PropTypes.number,
		delta: PropTypes.number
	}

	static defaultProps = {
		flickThreshold: 0.6,
		delta: 10
	}


	state = {
		x: null,
		y: null,
		swiping: false,
		start: 0
	}


	calculatePos (e) {
		let x = e.changedTouches[0].clientX;
		let y = e.changedTouches[0].clientY;

		let xd = this.state.x - x;
		let yd = this.state.y - y;

		let axd = Math.abs(xd);
		let ayd = Math.abs(yd);

		return {
			deltaX: xd,
			deltaY: yd,
			absX: axd,
			absY: ayd
		};
	}

	touchStart = (e) => {
		if (e.touches.length > 1) {
			return;
		}
		this.setState({
			start: Date.now(),
			x: e.touches[0].clientX,
			y: e.touches[0].clientY,
			swiping: false
		});
	}

	touchMove = (e) => {
		if (!this.state.x || !this.state.y || e.touches.length > 1) {
			return;
		}

		let cancelPageSwipe = false;
		let pos = this.calculatePos(e);

		if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
			return;
		}

		if (pos.absX > pos.absY) {
			if (pos.deltaX > 0) {
				if (this.props.onSwipingLeft) {
					this.props.onSwipingLeft(e, pos.absX);
					cancelPageSwipe = true;
				}
			} else {
				if (this.props.onSwipingRight) {
					this.props.onSwipingRight(e, pos.absX);
					cancelPageSwipe = true;
				}
			}
		} else {
			if (pos.deltaY > 0) {
				if (this.props.onSwipingUp) {
					this.props.onSwipingUp(e, pos.absY);
					cancelPageSwipe = true;
				}
			} else {
				if (this.props.onSwipingDown) {
					this.props.onSwipingDown(e, pos.absY);
					cancelPageSwipe = true;
				}
			}
		}

		this.setState({ swiping: true });

		if (cancelPageSwipe) {
			e.preventDefault();
		}
	}

	touchEnd = (ev) => {
		if (this.state.swiping) {
			let pos = this.calculatePos(ev);

			let time = Date.now() - this.state.start;
			let velocity = Math.sqrt(pos.absX * pos.absX + pos.absY * pos.absY) / time;
			let isFlick = velocity > this.props.flickThreshold;

			this.props.onSwiped && this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

			if (pos.absX > pos.absY) {
				if (pos.deltaX > 0) {
					this.props.onSwipedLeft && this.props.onSwipedLeft(ev, pos.deltaX);
				} else {
					this.props.onSwipedRight && this.props.onSwipedRight(ev, pos.deltaX);
				}
			} else {
				if (pos.deltaY > 0) {
					this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY);
				} else {
					this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY);
				}
			}
		}

		this.setState(this.getInitialState());
	}

	render () {
		const props = {
			...this.props,
			onTouchStart: this.touchStart,
			onTouchMove: this.touchMove,
			onTouchEnd: this.touchEnd
		};

		for (let prop of Object.keys(Swipeable.propTypes)) {
			delete props[prop];
		}

		return <div {...props}/>;
	}
}

export default class SwipeToRevealOptions extends React.Component {
	static propTypes = {
		rightOptions: PropTypes.array,
		leftOptions: PropTypes.array,
		className: PropTypes.string,
		actionThreshold: PropTypes.number,
		visibilityThreshold: PropTypes.number,
		transitionBackTimeout: PropTypes.number,
		callActionWhenSwipingFarLeft: PropTypes.bool,
		callActionWhenSwipingFarRight: PropTypes.bool,
		transitionBackOnRightClick: PropTypes.bool,
		transitionBackOnLeftClick: PropTypes.bool,
		closeOthers: PropTypes.func,
		onRightClick: PropTypes.func,
		onLeftClick: PropTypes.func,
		onReveal: PropTypes.func,
		onClose: PropTypes.func,
		maxItemWidth: PropTypes.number,
		parentWidth: PropTypes.number
	}

	static defaultProps = {
		rightOptions: [],
		leftOptions: [],
		className: '',
		actionThreshold: 300,
		visibilityThreshold: 50,
		transitionBackTimeout: 400,
		onRightClick: function onRightClick () {},
		onLeftClick: function onLeftClick () {},
		onReveal: function onReveal () {},
		onClose: function onClose () {},
		closeOthers: function closeOthers () {},
		maxItemWidth: 120,
		parentWidth: (typeof window !== 'undefined' && window.outerWidth) || (typeof global.screen !== 'undefined' && global.screen.width) || 320
	};

	state = {
		delta: 0,
		showRightButtons: false,
		showLeftButtons: false,
		swipingLeft: false,
		swipingRight: false,
		transitionBack: false,
		action: null,
		callActionWhenSwipingFarRight: false,
		callActionWhenSwipingFarLeft: false,
		transitionBackOnRightClick: true,
		transitionBackOnLeftClick: true
	}


	componentWillUnmount () {
		clearTimeout(this._timeout);
	}

	render () {
		const {className, leftOptions, rightOptions, ...props} = this.props;
		let classes = className + ' stro-container';
		if (this.state.transitionBack) {
			classes += ' transition-back';
		}
		if (this.state.showRightButtons) {
			classes += ' show-right-buttons';
		}
		if (this.state.showLeftButtons) {
			classes += ' show-left-buttons';
		}

		return (
			<div className={classes} style={this.getContainerStyle()}>
				<div className="stro-left">
					{leftOptions.map((option, index) => {
						const propsLabel = { style: this.getSpanStyle('left', index) };
						if (typeof option.label === 'string') {
							propsLabel.dangerouslySetInnerHTML = {
								__html: option.label,
							};
						}

						return (
							<div key={'swipe-left-option-' + index} className={'stro-button stro-left-button ' + option.class} onClick={() => this.leftClick(option)} style={this.getStyle('left', index)}>
								<span {...propsLabel}>{typeof option.label !== 'string' && option.label || void 0}</span>
							</div>
						);
					})}
				</div>

				<Swipeable className="stro-content"
					onSwipingLeft={this.swipingLeft}
					onClick={this.handleContentClick}
					onSwipingRight={this.swipingRight}
					onSwiped={this.swiped}
					delta={15}
					{...props}
				/>

				<div className="stro-right">
					{rightOptions.map((option, index) => {
						const propsLabel = { style: this.getSpanStyle('right', index) };
						if (typeof option.label === 'string') {
							propsLabel.dangerouslySetInnerHTML = {
								__html: option.label,
							};
						}
						return (
							<div key={'swipe-right-option-' + index} className={'stro-button stro-right-button ' + option.class} onClick={() => this.rightClick(option)} style={this.getStyle('right', index)}>
								<span {...propsLabel}>{typeof option.label !== 'string' && option.label || void 0}</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	swipingLeft = (event, delta) => {
		if (this.swipingHandleStylesAndDelta(delta, 'left')) {
			return;
		}

		let action = null;
		if (delta > this.props.visibilityThreshold) {
			action = 'rightVisible';
		}
		if (this.props.callActionWhenSwipingFarLeft && delta > this.props.actionThreshold) {
			action = 'rightAction';
		}

		this.setState({
			delta: -delta,
			action: action,
			swipingLeft: true
		});
	}

	swipingRight = (event, delta) => {
		if (this.swipingHandleStylesAndDelta(delta, 'right')) {
			return;
		}

		let action = null;
		if (delta > this.props.visibilityThreshold) {
			action = 'leftVisible';
		}
		if (this.props.callActionWhenSwipingFarRight && delta > this.props.actionThreshold) {
			action = 'leftAction';
		}

		this.setState({
			delta: delta,
			action: action,
			swipingRight: true
		});
	}

	swipingHandleStylesAndDelta (delta, direction) {
		if (this.shouldAbort(direction)) {
			return true;
		}

		this.shouldTransitionBack(direction);
		this.shouldCloseOthers(direction);

		return false;
	}

	shouldAbort (direction) {
		if (this.state.transitionBack) {
			return true;
		}
		if (direction === 'right') {
			return !this.props.leftOptions.length && !this.state.showRightButtons || this.state.showLeftButtons && !this.props.callActionWhenSwipingFarRight;
		} else {
			return !this.props.rightOptions.length && !this.state.showLeftButtons || this.state.showRightButtons && !this.props.callActionWhenSwipingFarLeft;
		}
	}

	shouldTransitionBack (direction) {
		if (direction === 'right' && this.state.showRightButtons || this.state.showLeftButtons) {
			this.transitionBack();
		}
	}

	shouldCloseOthers (direction) {
		if (this.props.closeOthers) {
			if (direction === 'right' && !this.state.swipingRight || !this.state.swipingLeft) {
				this.props.closeOthers();
			}
		}
	}

	swiped = () => {
		switch (this.state.action) {
		case 'rightVisible':
			this.revealRight();
			break;
		case 'leftVisible':
			this.revealLeft();
			break;
		case 'leftAction':
			this.leftClick(this.props.leftOptions[0]);
			break;
		case 'rightAction':
			this.rightClick(this.props.rightOptions[this.props.rightOptions.length - 1]);
			break;
		}

		this.setState({
			delta: 0,
			action: null,
			swipingLeft: false,
			swipingRight: false,
			secondarySwipe: false,
			transitionBack: true
		});

		clearTimeout(this._timeout);
		this._timeout = setTimeout(() =>
			this.setState({ transitionBack: false }), this.props.transitionBackTimeout);
	}

	revealRight = () => {
		this.props.onReveal('right');
		this.setState({ showRightButtons: true, showLeftButtons: false});
	}

	revealLeft = () => {
		this.props.onReveal('left');
		this.setState({ showRightButtons: false, showLeftButtons: true});
	}

	rightClick = (option) => {
		this.props.onRightClick(option);
		if (this.props.transitionBackOnRightClick) {this.transitionBack();}
	}

	leftClick = (option) => {
		this.props.onLeftClick(option);
		if (this.props.transitionBackOnLeftClick) {this.transitionBack();}
	}

	close = () => {
		this.transitionBack();
	}

	transitionBack = () => {
		this.props.onClose();
		this.setState({
			showLeftButtons: false,
			showRightButtons: false,
			transitionBack: true
		});
		if (this._timeout) {
			clearTimeout(this._timeout);
		}
		this._timeout = setTimeout((function () {
			this.setState({ transitionBack: false });
		}).bind(this), this.props.transitionBackTimeout);
	}

	getContainerStyle () {
		let itemWidth;
		if (this.state.delta === 0 && this.state.showRightButtons) {
			itemWidth = this.getItemWidth('right');
			return translateStyle(-this.props.rightOptions.length * itemWidth, 'px');
		} else if (this.state.delta === 0 && this.state.showLeftButtons) {
			itemWidth = this.getItemWidth('left');
			return translateStyle(this.props.leftOptions.length * itemWidth, 'px');
		}
		return translateStyle(this.state.delta, 'px');
	}

	getItemWidth (side) {
		let nbOptions = side === 'left' ? this.props.leftOptions.length : this.props.rightOptions.length;
		return Math.min(this.props.parentWidth / (nbOptions + 1), this.props.maxItemWidth);
	}

	getStyle (side, index) {
		let factor = side === 'left' ? -1 : 1;
		let nbOptions = side === 'left' ? this.props.leftOptions.length : this.props.rightOptions.length;
		let width = this.getItemWidth(side);
		let transition;
		let style;

		if (this.state.transitionBack || (side === 'left' && this.state.showLeftButtons || this.state.showRightButtons)) {
			style = translateStyle(factor * index * width, 'px');
			return style;
		}

		let modifier = index * 1 / nbOptions;
		let offset = -factor * modifier * this.state.delta;
		if (Math.abs(this.state.delta) > this.props.actionThreshold && (side === 'left' && this.props.callActionWhenSwipingFarRight || this.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
			transition = 'transform 0.15s ease-out';
			offset = 0;
		} else if (nbOptions * width < Math.abs(this.state.delta)) {
			offset += factor * (Math.abs(this.state.delta) - nbOptions * width) * 0.85;
		}
		style = translateStyle(offset, 'px');
		if (transition) {
			style.transition = transition;
		}
		return style;
	}

	getSpanStyle (side, index) {
		let width = this.getItemWidth(side);
		let factor = side === 'left' ? 1 : -1;
		let nbOptions = side === 'left' ? this.props.leftOptions.length : this.props.rightOptions.length;
		let padding;
		let style;

		if (this.state.transitionBack || (side === 'left' && this.state.showLeftButtons || this.state.showRightButtons)) {
			style = translateStyle(0, 'px', '-50%');
			style.width = width;
			return style;
		}

		if (Math.abs(this.state.delta) > this.props.actionThreshold && (side === 'left' && this.props.callActionWhenSwipingFarRight || this.props.callActionWhenSwipingFarLeft) && index === nbOptions - 1) {
			padding = 0;
		} else if (nbOptions * width < Math.abs(this.state.delta)) {
			padding += factor * (Math.abs(this.state.delta) - nbOptions * width) * 0.425;
		}
		style = translateStyle(padding, 'px', '-50%');
		style.width = width;
		return style;
	}

	handleContentClick = () => {
		this.props.closeOthers();
		this.transitionBack();
	}
}
