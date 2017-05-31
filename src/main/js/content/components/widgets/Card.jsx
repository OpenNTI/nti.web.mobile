import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import Card from 'common/components/Card';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'NTICard',
	mixins: [Mixin],

	statics: {
		itemType: /ntirelatedworkref$|nticard$|externallink$/i,

		interactiveInContext: true
	},


	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object
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
				item.description = el && el.innerHTML;
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
