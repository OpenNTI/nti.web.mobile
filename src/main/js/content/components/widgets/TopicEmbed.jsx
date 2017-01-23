import React from 'react';
import {scoped} from 'nti-lib-locale';
import {encodeForURI} from 'nti-lib-ntiids';
import {getConfigFor} from 'nti-web-client';

import Mixin from './Mixin';

//Hack until we can get context to work
const basePath = (x => (x = getConfigFor(x), typeof x === 'string' ? x : '/'))('basepath');

const DEFAULT_TEXT = {
	join: 'Join the Discussion'
};

const t = scoped('TOPIC_EMBED_WIDGET', DEFAULT_TEXT);


export default React.createClass({
	displayName: 'EmbededTopic',

	mixins: [Mixin],

	statics: {
		itemType: /embededtopic/i
	},

	propTypes: {
		item: React.PropTypes.object
	},


	getHref (props = this.props) {
		const {item} = props;
		const {ntiid} = item;

		return `${basePath}object/${encodeForURI(ntiid)}/`;
	},


	componentWillMount () {
		this.setState({href: this.getHref()});
	},


	componentWillReceiveProps (nextProps) {
		const {item:newItem} = nextProps;
		const {item:oldItem} = this.props;

		if (oldItem !== newItem) {
			this.setState({href: this.getHref(nextProps)});
		}
	},


	render () {
		const {href} = this.state;

		return (
			<a className="embedded-topic-widget" role="button" href={href}>
				<span>{t('join')}</span>
			</a>
		);
	}
});
