// import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Card, Mixins} from 'nti-web-commons';
// import {encodeForURI} from 'nti-lib-ntiids';

import ContextAccessor from 'common/mixins/ContextAccessor';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'NTICard',
	mixins: [Mixin, ContextAccessor, Mixins.NavigatableMixin],

	statics: {
		itemType: /relatedworkref$|nticard$|externallink$/i,

		interactiveInContext: true
	},


	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object
	},


	contextTypes: {
		analyticsManager: PropTypes.object.isRequired
	},


	componentWillUnmount () {
		this.setState = () => {};
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


	async componentDidMount () {
		this.setState({
			context: await this.resolveContext()
		});
	},


	handleClick (e) {
		// const {item} = this.props;
		// const {analyticsManager} = this.context;
		// const resourceId = item.NTIID || item.ntiid; //Cards built from DOM have lowercase.
		// this.setState({
		// 	context: analyticsManager.toAnalyticsPath(context, resourceId)
		// });
	},


	getHref (ntiid, {external} = {}) {
		return ntiid; //No slug, assume we're in a context that can understand raw NTIID links
	},


	render () {
		const {item, contentPackage} = this.props;
		return (
			<Card item={item} contentPackage={contentPackage} getRoute={this.getHref} onClick={this.handleClick}/>
		);
	}
});
