import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {toAnalyticsPath} from 'nti-analytics';
import {Card, Mixins} from 'nti-web-commons';
import {encodeForURI} from 'nti-lib-ntiids';

import ContextAccessor from '../mixins/ContextAccessor';


export default createReactClass({
	displayName: 'RelatedWorkRef',
	mixins: [ContextAccessor, Mixins.NavigatableMixin],

	propTypes: {
		externalSlug: PropTypes.string,
		slug: PropTypes.string
	},

	statics: {
		isExternal: Card.isExternal
	},


	isExternal (props = this.props) {
		const {item, internalOverride} = props || {};
		return Card.isExternal(item) && !internalOverride;
	},

	componentWillUnmount () {
		this.setState = () => {};
	},


	async componentDidMount () {
		const context = await this.resolveContext();
		const {item} = this.props;
		const resourceId = item.NTIID || item.ntiid; //Cards built from DOM have lowercase.
		this.setState({
			context: toAnalyticsPath(context, resourceId)
		});
	},


	getHref (ntiid, {external} = {}) {
		const {slug, externalSlug} = this.props;
		const prefix = external ? externalSlug : slug;

		return prefix
			? this.makeHref(path.join(prefix, encodeForURI(ntiid)) + '/', true)
			: ntiid; //No slug, assume we're in a context that can understand raw NTIID links
	},


	render () {
		return <Card {...this.props} {...this.state} getRoute={this.getHref}/>;
	}
});
