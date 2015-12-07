import React from 'react';

import './EmbededWidget.scss';

import Url from 'url';
import QueryString from 'query-string';

import MESSAGES from 'common/utils/WindowMessageListener';

import Mixin from './Mixin';

const NO_SOURCE_ID = 'No source id specified!';

export default React.createClass({
	displayName: 'embeded-widget',
	mixins: [Mixin],

	statics: {
		itemType: /embeded\.widget/i,
		interactiveInContext: false
	},


	propTypes: {
		item: React.PropTypes.object
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
			console.debug(`Ignoring event, ${sourceName} != ${id} %o`, e.data);
			return;
		}

		if (method === 'resize') {
			this.setState({height: parseInt(value, 10)});
		}
	},


	setup (props = this.props) {

		let {item = {}} = props;
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

		this.setState({sourceName, source, height, splash, defer});
	},


	onSplashClicked (e) {
		e.preventDefault();
		e.stopPropagation();

		this.setState({splash: null});
	},


	render () {
		const {state: {source, height, splash, defer}} = this;

		const skip = splash && defer !== false;

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
						allowTransparency="true"
						/>
				)}
			</div>
		);
	}
});
