import React from 'react';

import cx from 'classnames';

import Mixin from '../Mixin';
import RollCommon, {stop} from './Mixin';


const allowZoom = false;

function getTransform (offset, z = 0) {
	let transform = `translate3d(${offset}px, 0, ${z}px)`;
	return {
		boxShadow: offset ? '0 0 5px #000' : null,
		borderRadius: offset ? '1px' : null,//iOS bug workaround for boxShadow
		WebkitTransform: transform,
		MozTransform: transform,
		msTransform: transform,
		transform
	};
}

function getZOffset (offset, max) {
	let ratio = (offset / max);
	if (!isFinite(ratio)) {
		ratio = 1;
	}
	return 5 * ratio;
}

export default React.createClass({
	displayName: 'ImageRoll',
	mixins: [Mixin, RollCommon],

	statics: {
		itemType: 'image-collection'
	},


	propTypes: {
		item: React.PropTypes.object
	},


	getItemCount () { return this.getImages().length; },


	getImages () {
		let {images} = this.props.item || {};
		return images || [];
	},


	getImage (index) {
		return this.getImages()[index];
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


	onZoom (e) { stop(e); global.alert('zoom zoom'); },


	getImageStyle (image) {
		let {src} = image || {};

		return src && { backgroundImage: `url(${src})` };
	},


	getOffsetAndBound () {
		let {touch, touchEnd} = this.state;
		let {pixelOffset = 0, targetWidth = 0} = touch || touchEnd || {};
		return {pixelOffset, targetWidth};
	},


	getCurrentItemStyle () {
		let style = this.getImageStyle(this.getCurrentImage());
		if (!style) { return void 0; }

		let {pixelOffset, targetWidth} = this.getOffsetAndBound();

		if (pixelOffset > 0) {
			Object.assign(style, getTransform(pixelOffset));
		} else if (pixelOffset < 0) {
			let z = getZOffset(pixelOffset, targetWidth);

			Object.assign(style, getTransform(0, z));
		}

		return style;
	},


	getNextItemStyle () {
		let style = this.getImageStyle(this.getNextImage());
		if (!style) { return void 0; }

		let {pixelOffset} = this.getOffsetAndBound();

		if (pixelOffset < 0) {
			Object.assign(style, getTransform(pixelOffset));
		}

		return style;
	},


	getPreviousItemStyle () {
		let style = this.getImageStyle(this.getPrevImage());
		if (!style) { return void 0; }

		let {pixelOffset, targetWidth} = this.getOffsetAndBound();

		let z = -getZOffset(targetWidth, targetWidth);

		if (pixelOffset > 0) {
			z += getZOffset(pixelOffset, targetWidth);
		}

		Object.assign(style, getTransform(0, z));

		return style;
	},


	render () {
		let count = this.getItemCount();
		let {item} = this.props;
		let {touchEnd, touch = {}} = this.state;
		let {title} = item;

		let empty = count === 0;

		let current = this.getCurrentImage() || {};

		let next = this.getNextItemStyle();
		let prev = this.getPreviousItemStyle();
		let style = this.getCurrentItemStyle();

		let handlers = {
			onTouchStart: this.onTouchStart,
			onTouchMove: this.onTouchMove,
			onTouchEnd: this.onTouchEnd
		};

		let stageClasses = cx('stage', {
			transitioning: !!touchEnd,
			touching: touch.sliding > 1
		});

		return (
			<div className="media-roll image-roll">
				<label>{title}</label>
				<div ref="stage" className={stageClasses} {...handlers}>

					{empty ? (

						<div className="item image" style={style} data-empty-message="No Images"/>

					) : (

						<div ref="current" className="item image current" style={style}>
							<img src={current.src} alt={current.alt} title={current.title} />

							{allowZoom && ( <a href="#zoom" className="zoom fi-magnifying-glass" onClick={this.onZoom}/> )}
							{prev && ( <button className="prev" onClick={this.onPrev} alt="previous"/> )}
							{next && ( <button className="next" onClick={this.onNext} alt="next"/> )}
						</div>

					)}

					{prev && ( <div className="item image prev" style={prev} /> )}
					{next && ( <div className="item image next" style={next} /> )}

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
				<a href="#" onClick={this.onThumbnailClick} title="thumbnail"><div className="icon fi-eye"/></a>
			</li>
		);
	}
});
