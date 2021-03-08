import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Card, Mixins } from '@nti/web-commons';
import { isNTIID, encodeForURI } from '@nti/lib-ntiids';
import ContextAccessor from 'internal/common/mixins/ContextAccessor';

import Mixin from './Mixin';
import './Card.scss';

export default createReactClass({
	displayName: 'NTICard',
	mixins: [Mixin, ContextAccessor, Mixins.NavigatableMixin],

	statics: {
		itemType: /relatedworkref$|nticard$|externallink$/i,

		interactiveInContext: true,
	},

	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object,
	},

	contextTypes: {
		analyticsManager: PropTypes.object.isRequired,
	},

	componentWillUnmount() {
		this.setState = () => {};
	},

	async componentDidMount() {
		let { item } = this.props;
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

		this.setState({
			context: await this.resolveContext(),
		});
	},

	handleClick(e) {
		const {
			props: { item },
			state: { context = [] },
		} = this;
		const { analyticsManager } = this.context;
		const resourceId = item.ntiid; //Cards built from DOM have lowercase.

		if (this.isExternal()) {
			analyticsManager.ExternalResourceView.send(resourceId, {
				context: analyticsManager.toAnalyticsPath(context, resourceId),
			});
		}
	},

	getHref() {
		const { item } = this.props;
		return this.isExternal() ? item.href : encodeForURI(item.href);
	},

	isExternal() {
		const { item } = this.props;
		return !isNTIID(item.href);
	},

	render() {
		const { item, contentPackage } = this.props;
		const href = this.getHref();

		if (!href) {
			return <p className="content-not-found">Unable to load reading.</p>;
		}

		return (
			<a
				href={href}
				onClick={this.handleClick}
				rel="noreferrer"
				target={this.isExternal() ? '_blank' : null}
			>
				<Card item={item} contentPackage={contentPackage} />
			</a>
		);
	},
});
