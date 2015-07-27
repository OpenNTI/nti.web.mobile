import React from 'react';

import Path from 'path';
import Url from 'url';
import QueryString from 'query-string';

import MESSAGES from 'common/utils/WindowMessageListener';

import Mixin from './Mixin';

const ALLOWED_ORIGIN = 'http://storify.com';

export default React.createClass({
	displayName: 'storify-embed',
	mixins: [Mixin],

	statics: {
		itemType: /storify/i,

		interactiveInContext: false
	},


	propTypes: {
		item: React.PropTypes.object
	},


	componentWillMount () { this.setup(); },
	componentWillReceiveProps (nextProps) { this.setup(nextProps); },
	componentDidMount () { MESSAGES.add(this.onMessage); },
	componentWillUnmount () { MESSAGES.remove(this.onMessage); },

	onMessage (e) {
		let {method, value, sourceName} = JSON.parse(e.data) || {};
		if (!e.origin === ALLOWED_ORIGIN || this.state.sourceName !== sourceName) {
			console.debug('Ignoring event from "%s:" %o', e.origin, e.data);
			return;
		}

		if (method === 'resize') {
			this.setState({height: parseInt(value, 10)});
		}
	},

	setup (props = this.props) {

		let {item = {}} = props;
		let {source} = item;
		let sourceName;

		if (source) {
			let url = Url.parse(source);

			//Turn the story url into an embed url.
			if (!/embed$/.test(url.pathname)) {
				url.pathname = Path.join(url.pathname, 'embed');
			}

			//Ensure some props...merge the rest.
			url.search = QueryString.stringify(
							Object.assign(
								QueryString.parse(url.search),
								{
									header: false,
									border: false
								}));


			// Storify's "Source Name" value is the owner and the story id...
			// those are the first two path components.
			sourceName = url.pathname.split('/').slice(0, 2).join('-');

			if (url.protocol && url.protocol !== 'https:') {
				console.warn('Storify URL not protocoless nor HTTPS! : %s', source);
			}

			//pull it all together...
			source = url.format();
		}

		this.setState({sourceName, source});
	},


	render () {
		let {source, height=0} = this.state;
		return source && (
			<iframe src={source}
				width="100%"
				height={height}
				frameBorder="no"
				allowTransparency="true"/>
		);
	}
});
