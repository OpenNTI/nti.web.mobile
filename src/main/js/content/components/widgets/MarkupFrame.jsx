import React from 'react';
import isEmpty from 'dataserverinterface/utils/isempty';

const ZOOMABLE = /nti\-data\-resizeable/i;

export default React.createClass({
	displayName: 'ContentMarkupEnabled',

	statics: {
		flag: /nti\-data\-markupenabled/i,
		handles (item) {
			return this.flag.test(item.type);
		}
	},


	componentDidMount () {},


	componentWillUnmount () {},


	render () {
		var data = this.props.item;
		var item = data.item;

		var zoomable = ZOOMABLE.test(data.type);

		var title = item.title;
		var caption = item.caption;

		var noDetails = isEmpty(title) && isEmpty(caption);

		//The Item may not be an image... what can it be?

		return (
			<span itemProp={data.type}>
				<img src={item.src} dataset={item.dataset} crossOrigin={item.crossorigin}/>
				<span className="wrapper">
					<a href="#zoom" title="Zoom" className={"zoom " + (zoomable ? '':'disabled')} data-non-anchorable="true"/>
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
