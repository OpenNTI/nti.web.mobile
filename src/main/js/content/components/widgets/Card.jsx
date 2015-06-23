import React from 'react';

import Card from 'common/components/Card';

import Mixin from './Mixin';

export default React.createClass({
	displayName: 'NTICard',
	mixins: [Mixin],

	statics: {
		itemType: /ntirelatedworkref$|nticard$/i
	},


	propTypes: {
		item: React.PropTypes.object,
		contentPackage: React.PropTypes.object
	},


	componentWillMount () {
		let {item} = this.props;
		let el;
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
		let {item, contentPackage} = this.props;
		//We do not pass a slug, because this widget represents a Card from within Content.
		//It's NTIID is the link, and we handle that specially...
		return (
			<Card item={item} contentPackage={contentPackage}/>
		);
	}
});
