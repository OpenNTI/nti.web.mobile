import React from 'react';

import path from 'path';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import ContentAquirePrompt from 'catalog/components/ContentAquirePrompt';

import Loading from 'common/components/Loading';

import NotFound from 'notfound/components/View';

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
			.then(o=> {
				this.setState({object: o});
				return o;
			})
			.then(resolve)
			.then(p=> path.join(this.getBasePath(), p))
			.then(location => this.setState({location}))
			.catch(error => {

				if (ContentAquirePrompt.shouldPrompt(error)) {
					return this.setState({prompt: error});
				}

				return Promise.reject(error);
			})
			.catch(error => {
				console.error('Could not resolve: %o', error);
				this.setState({error});
			});
	},


	render () {
		let {location, error, prompt, object} = this.state;
		return location ? (
			<Redirect location={location}/>
		) : error ? (
			<NotFound/>
		) : prompt ? (
			<ContentAquirePrompt data={prompt} relatedItem={object}/>
		) : (
			<Loading />
		);
	}
});
