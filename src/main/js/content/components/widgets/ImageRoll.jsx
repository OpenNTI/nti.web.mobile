import React from 'react';

import cx from 'classnames';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import Mixin from './Mixin';

const stop = e => { e.preventDefault(); e.stopPropagation(); };

function getTouch(e, id) {
	return Array.from(e.targetTouches || [])
		.find(i=>i.identifier === id);
}

function getTransform (offset, z = 0) {
	let filter;

	let b = Math.abs(Math.round(z));
	if (isFinite(b) && z) {

		filter = `blur(${b}px) saturate(${100 - (b * 3)}%)`;
	}

	let transform = `translate3d(${offset}px, 0, ${z}px)`;
	return {
		boxShadow: offset ? '0 0 5px #000' : null,
		borderRadius: offset ? '1px' : null,//iOS bug workaround for boxShadow
		WebkitTransform: transform,
		MozTransform: transform,
		msTransform: transform,
		transform,

		MozFilter: filter,
		WebkitFilter: filter,
		msFilter: filter,
		filter: filter
	};
}

function getZOffset (offset, max) {
	return -Math.log2(Math.abs(offset)) - 3;
}

export default React.createClass({
	displayName: 'ImageRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'image-collection'
	},


	propTypes: {
		item: React.PropTypes.object
	},

	getInitialState () {
		return {
			current: 0
		};
	},

	getImages () {
		let {images} = this.props.item || {};
		return images || [];
	},


	getImage (index) {
		return this.getImages()[index];
	},


	getActiveIndex () {
		let {current = 0} = this.state;
		return current;
	},


	getCurrentImage () {
		return this.getImage(this.getActiveIndex());
	},


	getNextImage () {
		return this.getImage(this.getActiveIndex() + 1);
	},


	getPrevImage () {
		return this.getImage(this.getActiveIndex() - 1);
	},


	onPrev (e) { this.go(e, -1); },
	onNext (e) { this.go(e, 1); },


	go (e, n) {
		stop(e);
		e.target.blur();

		let images = this.getImages().length;
		let index = this.getActiveIndex();

		index = (index + n) % images;
		if (index < 0) {
			index += images;
		}

		this.setState({current: index});
	},


	onZoom (e) { stop(e); global.alert('zoom zoom'); },


	onThumbnailClick (e) {
		stop(e);
		let attr = 'data-index';
		let index = getEventTarget(e, `[${attr}]`);
		if (index) {
			index = parseInt(index.getAttribute(attr), 10);
			this.setState({current: index});
		}
	},


	componentDidUpdate (_, prevState) {
		let last = prevState ? prevState.current : 0;
		let current = this.getActiveIndex();
		let ref = 'thumbnail' + current;

		if (last !== current) {
			let node = React.findDOMNode(this.refs[ref]);
			if (node) {
				//subtract the width to keep it centered when it can be.
				node.parentNode.scrollLeft = (node.offsetLeft - node.offsetWidth);
			}

		}
	},


	onTouchStart (e) {
		let {touch} = this.state;

		if (!touch) {
			touch = e.targetTouches[0];

			e.stopPropagation();

			let {stage} = this.refs;
			stage = React.findDOMNode(stage);

			console.debug('Touch Start...');

			this.setState({
				touch: {
					targetWidth: stage.offsetWidth,
					pixelOffset: 0,
					startPixelOffset: 0,

					x: touch.clientX,
					y: touch.clientY,

					id: touch.identifier,

					sliding: 1,
					delta: 0
				}
			});
		}
	},


	onTouchMove (e) {
		let {state} = this;

		let data = state.touch;

		let {sliding, pixelOffset, startPixelOffset, targetWidth} = data;

		if (!data) {
			console.debug('No touch data...ignoring.');
			return;
		}


		let touch = getTouch(e, state.touch.id);


		let delta = 0;
		let touchPixelRatio = 1;

		if (touch) {
			e.stopPropagation();

			//Allow vertical scrolling
			if (Math.abs(touch.clientY - data.y) > Math.abs(touch.clientX - data.x)) {
				return;
			}

			e.preventDefault();

			delta = touch.clientX - data.x;

			if (sliding === 1 && delta) {
				sliding = 2;

				startPixelOffset = pixelOffset;

				console.debug('Touch move tripped...');
			}

			if (sliding === 2) {

				pixelOffset = startPixelOffset + (delta / touchPixelRatio);

				let sign = pixelOffset / Math.abs(pixelOffset);

				if(Math.abs(pixelOffset) > targetWidth) {
					pixelOffset = sign * targetWidth;
				}

				this.setState({
					touch: Object.assign(state.touch,
						{ delta, pixelOffset, startPixelOffset, sliding })
				});
			}
		}
	},


	onTouchEnd (e) {

		let {touch = {}} = this.state;

		let endedTouch = getTouch(e, touch.id);

		let {sliding, pixelOffset, startPixelOffset, targetWidth} = touch;

		let fn;

		if (sliding === 2) {
			stop(e);

			fn = (Math.abs(pixelOffset - startPixelOffset) / targetWidth) < 0.35 ? null ://elastic
				pixelOffset < startPixelOffset ? 'onNext' : 'onPrev';

			console.debug('Touch End, result: %s', fn || 'stay');

			// if(fn) {
			// 	this[fn]();
			// }

			this.setState({ touch: void 0 });
		}


		if (endedTouch || e.targetTouches.length === 0) {
			this.setState({ touch: void 0 });
		} else {
			console.debug('Not my touch', touch.id, e.targetTouches);
		}

	},


	getStageStyle (image) {
		let {src} = image || {};

		return src && { backgroundImage: `url(${src})` };
	},


	getCurrentItemStyle () {
		let style = this.getStageStyle(this.getCurrentImage());
		if (!style) { return void 0; }

		let {pixelOffset, targetWidth} = this.state.touch || {};

		if (pixelOffset > 0) {
			Object.assign(style, getTransform(pixelOffset));
		} else if (pixelOffset < 0) {
			let z = getZOffset(pixelOffset, targetWidth);

			Object.assign(style, getTransform(0, z));
		}

		return style;
	},


	getNextItemStyle () {
		let style = this.getStageStyle(this.getNextImage());
		if (!style) { return void 0; }

		let {pixelOffset} = this.state.touch || {};

		if (pixelOffset < 0) {
			Object.assign(style, getTransform(pixelOffset));
		}

		return style;
	},


	getPreviousItemStyle () {
		let style = this.getStageStyle(this.getPrevImage());
		if (!style) { return void 0; }

		let {targetWidth = 0, pixelOffset = 0} = this.state.touch || {};

		let z = getZOffset(targetWidth, targetWidth);

		if (pixelOffset > 0) {
			z += -getZOffset(pixelOffset, targetWidth);
		}

		Object.assign(style, getTransform(0, z));

		return style;
	},


	render () {
		let {length} = this.getImages();
		let {item} = this.props;
		let {touch = {}} = this.state;
		let {title} = item;

		let empty = length === 0;

		let current = this.getCurrentImage() || {};

		let next = this.getNextItemStyle();
		let prev = this.getPreviousItemStyle();
		let style = this.getCurrentItemStyle();

		let touchHandlers = {
			onTouchStart: this.onTouchStart,
			onTouchMove: this.onTouchMove,
			onTouchEnd: this.onTouchEnd
		};

		return (
			<div className="image-roll">
				<label>{title}</label>
				<div ref="stage" className={cx('stage', {touching: touch.sliding > 1})} {...touchHandlers}>

					{empty ? (

						<div className="image" style={style} data-empty-message="No Images"/>

					) : (

						<div className="image" style={style}>
							<img src={current.src} alt={current.alt} title={current.title} />

							<a href="#zoom" className="zoom fi-magnifying-glass" onClick={this.onZoom}/>
							{prev && ( <button className="prev" onClick={this.onPrev} alt="previous"/> )}
							{next && ( <button className="next" onClick={this.onNext} alt="next"/> )}
						</div>

					)}

					{prev && ( <div className="image prev" style={prev} /> )}
					{next && ( <div className="image next" style={next} /> )}

				</div>
				{this.renderList()}
			</div>
		);
	},


	renderList () {
		let images = this.getImages();
		return images.length > 1 ?
			React.createElement('ul', {ref: 'list'},
				...images.map((i, x)=>this.renderThumbnail(i, x))) :
			null;
	},


	renderThumbnail (image, index) {
		let {sizes = []} = image.source;
		let thumb = sizes[sizes.length - 1];
		let active = index === this.getActiveIndex();

		thumb = thumb && { backgroundImage: `url(${thumb})` };

		return (
			<li className={cx('thumbnail', {active})}
				ref={'thumbnail' + index}
				data-index={index}
				style={thumb}>
				<a href="#" onClick={this.onThumbnailClick} title="thumbnail"><div className="play fi-play-circle"/></a>
			</li>
		);
	}
});
