import React from 'react';

import cx from 'classnames';

import isEmpty from 'fbjs/lib/isEmpty';

import Mixin from './Mixin';

import Zoomable from 'common/zoomable/components/View';

export default React.createClass({
	displayName: 'ContentMarkupEnabled',
	mixins: [Mixin],

	statics: {
		itemType: /nti\-data\-markup(dis|en)abled/i
	},


	propTypes: {
		item: React.PropTypes.object
	},


	getInitialState () {
		return {
			zoomed: false
		};
	},


	onZoom () {
		let {refs: {image}} = this;
		if(image && image.src) {
			this.setState({
				zoomed: true
			});
		}
	},


	unZoom () {
		this.setState({
			zoomed: false
		});
	},


	onLoad () {
		const {refs: {image: i}} = this;
		if (i) {
			let w = i.naturalWidth || i.width;
			if (w > i.offsetWidth) {//image width vs on-screen width
				this.setState({forceZoomable: true});
			}
		}
	},


	render () {
		let {item, itemprop, isSlide} = this.props.item;

		let {zoomable, markable} = item;

		let title = item.title;
		let caption = item.caption;

		let noDetails = isEmpty(title) && isEmpty(caption);
		let bare = noDetails && !markable && !isSlide;

		//force zoom if the image has been scaled down and only if the frame will show.
		if (!bare && this.state.forceZoomable) {
			zoomable = true;
		}

		//FIXME: The Item may not be an image, it could also be a video embed, a slide, or an iframe.

		return (
			<span itemProp={itemprop} className={cx('markupframe', {bare})}>

				<span className="wrapper">
					<img id={item.id} src={item.src} crossOrigin={item.crossorigin} ref="image" onLoad={this.onLoad}/>
					{!zoomable ? null : (
						<a title="Zoom"
						className="zoom icon-search"
						data-non-anchorable="true"
						onClick={this.onZoom} />
					)}
				</span>

				{bare ? null : (
					<span className="bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
						{!isSlide ? null : ( <a href="#slide" className="bar-cell slide"/> )}
						{noDetails && !markable ? null : (
							<span className="bar-cell">
								<span className="image-title" dangerouslySetInnerHTML={{__html: title}}/>
								<span className="image-caption" dangerouslySetInnerHTML={{__html: caption}}/>
								{markable && ( <a href="#mark" className="mark"/> )}
							</span>
						)}
					</span>
				)}

				{this.state.zoomed && <Zoomable src={item.src} onClose={this.unZoom} />}
			</span>
		);
	}
});
