import React from 'react';

import Logger from 'nti-util-logger';

import Path from 'path';
import Url from 'url';
import QueryString from 'query-string';

import {WindowMessageListener as MESSAGES} from 'nti-lib-dom';

import Mixin from './Mixin';

const logger = Logger.get('content:widgets:EmbededWidget');

const NO_SOURCE_ID = 'No source id specified!';
const SANDBOX_FLAGS = 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts';

export default React.createClass({
	displayName: 'embeded-widget',
	mixins: [Mixin],

	statics: {
		itemType: /embeded\.widget/i,
		interactiveInContext: false
	},


	propTypes: {
		item: React.PropTypes.object,
		contentPackage: React.PropTypes.object
	},


	getInitialState () {
		return {
			source: null,
			height: 0
		};
	},


	componentWillMount () { this.setup(); },
	componentWillReceiveProps (nextProps) { this.setup(nextProps); },
	componentDidMount () { MESSAGES.add(this.onMessage); },
	componentWillUnmount () { MESSAGES.remove(this.onMessage); },

	getIdKey () {
		return this.props.item['uid-name'] || 'id';
	},


	onMessage (e) {
		const data = JSON.parse(e.data) || {};
		const id = data[this.getIdKey()];
		const {method, value} = data;
		const {state: {sourceName}} = this;

		if (sourceName === NO_SOURCE_ID || sourceName !== id) {
			logger.debug(`Ignoring event, ${sourceName} != ${id} %o`, e.data);
			return;
		}

		if (method === 'resize') {
			this.setState({height: parseInt(value, 10)});
		}
	},


	isNoSandboxSet ({item} = this.props) {
		return Boolean(item['no-sandboxing']);
	},


	setup (props = this.props) {

		const {contentPackage, item = {}} = props;
		const {
			defer,
			height = 0,
			source,
			splash = null,
			uid
		} = item;

		if (!source) {
			return;
		}

		const src = Url.parse(source);
		const q = QueryString.parse(src.search);

		const sourceName = uid || q[this.getIdKey()] || NO_SOURCE_ID;

		if (q[this.getIdKey()] !== sourceName) {
			q[this.getIdKey()] = encodeURIComponent(sourceName);
			src.search = QueryString.stringify(q);
		}

		const splashResolve = splash
			? contentPackage.resolveContentURL(splash).catch(()=> null)
			: Promise.resolve(splash);

		const pathResolve = Path.isAbsolute(src.pathname)
			? Promise.resolve(src.pathname)
			: contentPackage.resolveContentURL(src.pathname)
				.then(p => src.pathname = p);

		Promise.all([splashResolve, pathResolve])
			.then(([splashURL]) => {
				const uri = src.format();
				const sameOrigin = isSameOrigin(uri, (global.location || {}).origin);

				this.setState({
					sourceName,
					source: uri,
					sameOrigin,
					height,
					splash: splashURL,
					defer
				});
			});
	},


	onSplashClicked (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({splash: null});
	},


	render () {
		const {state: {sameOrigin, source, height, splash, defer}} = this;

		const skip = !source || (splash && defer !== false);

		const sandbox = sameOrigin && !this.isNoSandboxingSet() ? {sandbox: SANDBOX_FLAGS} : {};

		return source && (
			<div className="embeded-widget" style={{height}}>
				{splash && (
					<div onClick={this.onSplashClicked}
						className="splash"
						style={{backgroundImage: `url(${splash})`}}
						/>
				)}
				{skip ? null : (
					<iframe src={source}
						width="100%"
						height={height}
						frameBorder="no"
						scrolling="no"
						allowFullscreen
						allowTransparency
						seamless
						{...sandbox}
						/>
				)}
			</div>
		);
	}
});



function isSameOrigin (uri, as) {
	const toOrigin = (o) => (
		o = Url.parse(o),
		Object.assign(o, {pathname: '', search: '', hash: ''}),
		o.format()
	);

	return as && (toOrigin(uri) === toOrigin(as));
}
