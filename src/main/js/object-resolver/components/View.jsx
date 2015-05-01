import React from 'react';

import path from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';

import Redirect from 'navigation/components/Redirect';

import {getService} from 'common/utils';

import {resolve} from '../resolvers';

export default React.createClass({
	displayName: 'ObjectResolver',
	mixins: [BasePathAware],

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
			.then(resolve)
			.then(p=> path.join(this.getBasePath(), p))
			.then(location => this.setState({location}))
			// .catch(error => {
			// 	console.error('Could not resolve: %o', error);
			// 	this.setState({error});
			// });
			.catch(location => console.debug('Resolved: %o', location));
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
