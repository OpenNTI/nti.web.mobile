import React from 'react';
import isEmpty from 'nti.lib.interfaces/utils/isempty';

import Mixin from './Mixin';

const ZOOMABLE = /nti\-data\-resizeable/i;
const zoom = 'MarkupFrame:zoom';

export default React.createClass({
	displayName: 'ContentMarkupEnabled',
	mixins: [Mixin],

	statics: {
		itemType: /nti\-data\-markupenabled/i
	},


	propTypes: {
		item: React.PropTypes.object
	},


	componentDidMount () {},


	componentWillUnmount () {},

	[zoom]() {
		let img = React.findDOMNode(this.refs.image);
		if(img && img.src) {
			window.open(img.src, 'zoomy');
		}
	},

	render () {
		let data = this.props.item;
		let item = data.item;

		let zoomable = ZOOMABLE.test(data.type);

		let title = item.title;
		let caption = item.caption;

		let noDetails = isEmpty(title) && isEmpty(caption);

		//The Item may not be an image... what can it be?

		return (
			<span itemProp={data.type} className="markupframe">
				<img src={item.src} dataset={item.dataset} crossOrigin={item.crossorigin} ref='image' />
				<span className="wrapper">
					<a href="#zoom" title="Zoom" className={"zoom fi-magnifying-glass" + (zoomable ? '' : ' disabled')} data-non-anchorable="true" onClick={this[zoom]} />
				</span>
				<span className="bar" data-non-anchorable="true" data-no-anchors-within="true" unselectable="true">
					<a href="#slide" className="bar-cell slide"> </a>
					<span className={"bar-cell " + (noDetails ? 'no-details' : '')}>
						<span className="image-title">{title}</span>
						<span className="image-caption">{caption}</span>
						<a href="#mark" className="mark"></a>
					</span>
				</span>
			</span>
		);
	}
});
