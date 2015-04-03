import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';

import Redirect from 'navigation/components/Redirect';

import {getService} from 'common/utils';


export default React.createClass({
	displayName: 'ObjectResolver',

	propTypes: {
		objectId: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.resolveObject(this.props.objectId);
	},


	componentWillReceiveProps (nextProps) {
		let {objectId} = nextProps;
		if (this.props.objectId !== objectId) {
			this.resolveObject(objectId);
		}
	},


	resolveObject (id) {
		id = decodeFromURI(id);
		console.debug('Looking up object: %s', id);

		getService()
			.then(s=> s.getParsedObject(id))
			.then(o=> {
				console.debug('Resolve Object: %o', o);
				this.setState({location: '/mobile/'});
			});
	},


	render () {
		let {location} = this.state;
		return location ? (
			<Redirect location={location}/>
		) : (
			<Loading />
		);
	}
});
