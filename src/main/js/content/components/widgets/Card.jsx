import React from 'react';

import Card from 'common/components/Card';

export default React.createClass({
	displayName: 'NTICard',

	statics: {
		mimeType: /ntirelatedworkref$|nticard$/i,
		handles (item) {
			var re = this.mimeType;
			return re.test(item.type) || re.test(item.class);
		}
	},


	componentWillMount () {
		var {item} = this.props;
		var el;
		if (item) {

			if (!item.desc && item.dom) {
				//Because the item was interpreted from a DOM element, the
				//content of the element is the description.
				//
				//We aren't doing this correctly :P... we attempted to use
				//a HTML style "fallback" to allow us flexibility and all,
				//but we still split "data points" into it... hmm...
				el = item.dom.querySelector('span.description');
				item.desc = el && el.innerHTML;
			}

			if (!item.icon && item.dom) {
				//See comment above... sigh...
				el = item.dom.querySelector('img');
				item.icon = el && el.getAttribute('src');
			}

		}
	},


	render () {
		let {item, slug, contentPackage} = this.props;
		return (
			<Card
				item={item}
				slug={slug}
				contentPackage={contentPackage}/>
		);
	}
});
