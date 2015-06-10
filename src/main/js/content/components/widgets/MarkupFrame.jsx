import React from 'react';

import cx from 'classnames';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

import Mixin from './Mixin';

import Zoomable from 'common/zoomable/components/View';

const ZOOMABLE = /nti\-data\-resizeable/i;


export default React.createClass({
	displayName: 'ContentMarkupEnabled',
	mixins: [Mixin],

	statics: {
		itemType: /nti\-data\-markupenabled/i
	},


	propTypes: {
		item: React.PropTypes.object
	},


	getInitialState () {
		return {
			zoomed: false
		};
	},


	onZoom() {
		let {image} = this.refs;
		image = React.findDOMNode(image);

		if(image && image.src) {
			this.setState({
				zoomed: true
			});
		}
	},


	unZoom() {
		this.setState({
			zoomed: false
		});
	},


	onLoad () {
		let i = React.findDOMNode(this.refs.image);
		if (i) {
			let w = i.naturalWidth || i.width;
			if (w > i.offsetWidth) {//image width vs on-screen width
				this.setState({forceZoomable: true});
			}
		}
	},


	render () {
		let data = this.props.item;
		let {item} = data;

		let {zoomable = ZOOMABLE.test(data.type)} = item;

		if (this.state.forceZoomable) {
			zoomable = true;
		}

		let title = item.title;
		let caption = item.caption;

		let zoomClasses = cx('zoom fi-magnifying-glass', { disabled: !zoomable });

		let noDetails = isEmpty(title) && isEmpty(caption);

		//The Item may not be an image, it could also be a video embed, a slide, or an iframe.

		return (
			<span itemProp={data.type} className="markupframe">
				<span className="wrapper">
					<img id={item.id} src={item.src} crossOrigin={item.crossorigin} ref="image" onLoad={this.onLoad}/>
					<a title="Zoom"
						className={zoomClasses}
						data-non-anchorable="true"
						onClick={this.onZoom} />
				</span>
				<span className="bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
					<a href="#slide" className="bar-cell slide"> </a>
					<span className={'bar-cell ' + (noDetails ? 'no-details' : '')}>
						<span className="image-title" dangerouslySetInnerHTML={{__html: title}}/>
						<span className="image-caption" dangerouslySetInnerHTML={{__html: caption}}/>
						<a href="#mark" className="mark"></a>
					</span>
				</span>
				{this.state.zoomed && <Zoomable src={item.src} onClose={this.unZoom} />}
			</span>
		);
	}
});
