import React from 'react';
import isEmpty from 'nti.lib.interfaces/utils/isempty';

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
		let data = this.props.item;
		let item = data.item;

		let zoomable = ZOOMABLE.test(data.type);

		let title = item.title;
		let caption = item.caption;

		let noDetails = isEmpty(title) && isEmpty(caption);

		//The Item may not be an image... what can it be?

		return (
			<span itemProp={data.type}>
				<span className="wrapper">
					<a href="#zoom" title="Zoom" className={"zoom" + (zoomable ? '':' disabled')} data-non-anchorable="true"/>
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
