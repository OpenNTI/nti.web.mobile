import React from 'react';

import cx from 'classnames';

import getEventTarget from 'nti.lib.dom/lib/geteventtarget';

import Mixin from './Mixin';

const stop = e => { e.preventDefault(); e.stopPropagation(); };

export default React.createClass({
	displayName: 'ImageRoll',
	mixins: [Mixin],

	statics: {
		itemType: 'image-collection'
	},


	propTypes: {
		item: React.PropTypes.object
	},


	getImages () {
		let {images} = this.props.item || {};
		return images || [];
	},


	getImage (index) {
		return this.getImages()[index];
	},


	getActiveIndex () {
		let {current = 0} = this.state || {};
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


	getStageStyle (image) {
		let {src} = image || {};
		return src && { backgroundImage: `url(${src})` };
	},


	render () {
		let {length} = this.getImages();
		let {item} = this.props;
		let {title} = item;

		let empty = length === 0;

		let current = this.getCurrentImage() || {};

		let next = this.getStageStyle(this.getNextImage());
		let prev = this.getStageStyle(this.getPrevImage());

		let style = this.getStageStyle(current);

		return (
			<div className="image-roll">
				<label>{title}</label>
				<div className="stage">

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
