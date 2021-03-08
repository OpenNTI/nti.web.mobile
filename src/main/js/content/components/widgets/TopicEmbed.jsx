import './TopicEmbed.scss';
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';

import { scoped } from '@nti/lib-locale';
import { encodeForURI } from '@nti/lib-ntiids';
import { getConfig } from '@nti/web-client';
import { EmptyState } from '@nti/web-commons';

import Mixin from './Mixin';

const DEFAULT_TEXT = {
	join: 'Join the Discussion',
	noAccess: 'You do not have access to this discussion.',
};

const t = scoped('content.widgets.TopicEmbed', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'EmbededTopic',

	mixins: [Mixin],

	statics: {
		itemType: /embededtopic/i,
	},

	propTypes: {
		item: PropTypes.object,
	},

	getInitialState() {
		return {};
	},

	getHref(props = this.props) {
		const { item } = props;
		const { ntiid } = item;

		return ntiid && `${this.basePath}object/${encodeForURI(ntiid)}/`;
	},

	componentDidMount() {
		//Hack until we can get context to work
		this.basePath = (x => (
			(x = getConfig(x)), typeof x === 'string' ? x : '/'
		))('basepath');

		this.setState({ href: this.getHref() });
	},

	componentDidUpdate(prevProps, prevState) {
		const { item: newItem } = this.props;
		const { item: oldItem } = prevProps;

		if (oldItem !== newItem) {
			this.setState({ href: this.getHref() });
		}
	},

	render() {
		const { href } = this.state;

		if (!href) {
			return <EmptyState header={t('noAccess')} />;
		}

		return (
			<a className="embedded-topic-widget" role="button" href={href}>
				<span>{t('join')}</span>
			</a>
		);
	},
});
