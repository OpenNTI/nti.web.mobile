import React from 'react';
import PropTypes from 'prop-types';
import {Array as ArrayUtils} from 'nti-commons';
import {getService} from 'nti-web-client';

const {ensure: ensureArray} = ArrayUtils;
const getID = (x) => x && x.getID && x.getID();

function getThumbnail (item) {

	// walk up from the deep end of the path looking for an icon
	const getIcon = x => {
		const p = ensureArray(x).slice();
		let part, result;
		while(!result && (part = p.pop())) {
			result = (part.getPresentationProperties && part.getPresentationProperties().thumb) || part.icon;
		}
		return result;
	};

	try {

		return getService()
			.then(service =>
				item.getContextPath()
					.catch(e => (e && e.statusCode === 403 && e.Items)
						? service.getObject(e.Items)
						: Promise.reject(e)))

			.then(path => getIcon(path[0]))

			//If there is an error, resolve with null
			.catch(() => null);

	} catch (e) {
		//Really, the only error this should be is item is falsy, or item does not have a getContextPath method.
		return Promise.reject(e);
	}
}


export default class extends React.Component {
	static displayName = 'ContentIcon';

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	state = {};

	componentDidMount () {
		this.load();
	}

	componentWillReceiveProps (nextProps) {
		let {item} = this.props;
		let {item: nextItem} = nextProps;
		if(getID(item) !== getID(nextItem)) {
			this.load(nextProps);
		}
	}

	load = (props = this.props) => {
		let {item} = props;
		if (item) {
			getThumbnail(item)
				.catch(() => null) //any error, set src to null.
				.then(src => this.setState({ src }));
		}
		else {
			this.setState({ src: null });
		}
	};

	render () {
		let {src} = this.state;

		return !src ? null : (
			<img src={src} />
		);
	}
}
