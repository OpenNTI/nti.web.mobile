import React from 'react';

import {getService} from 'common/utils';

function getThumbnail (item) {

	const getIcon = x => (x.getPresentationProperties
						? x.getPresentationProperties()
						: x).thumb;

	try {

		return getService()
			.then(service =>
				item.getContextPath()
					.catch(e => (e && e.statusCode === 403 && e.Items)
						? service.getParsedObject(e.Items)
						: Promise.reject(e)))

			.then(path => getIcon(path[0][0]))

			//If there is an error, resolve with null
			.catch(() => null);

	} catch (e) {
		//Really, the only error this should be is item is falsy, or item does not have a getContextPath method.
		return Promise.reject(e);
	}
}


export default React.createClass({
	displayName: 'ContentIcon',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentDidMount () {
		this.load();
	},

	componentWillReceiveProps (nextProps) {
		this.load(nextProps);
	},

	load (props=this.props) {
		let {item} = props;
		if (item) {
			getThumbnail(item)
				.catch(() => null) //any error, set src to null.
				.then(src => this.setState({ src }));
		}
		else {
			this.setState({ src: null });
		}
	},

	render () {
		let {src} = this.state;

		return !src ? null : (
			<img src={src} />
		);
	}
});
