import React from 'react';

import path from 'path';

import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';

import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import Loading from 'common/components/Loading';

import NotFound from 'notfound/components/View';

import BasePathAware from 'common/mixins/BasePath';

import Redirect from 'navigation/components/Redirect';

import {getService} from 'common/utils';

import {resolve} from '../resolvers';

const logger = Logger.get('object-resolver:components:View');


const filter = o => (o && o.MimeType === 'application/vnd.nextthought.change' && o.Item) ? o.Item : o;


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
		logger.debug('Looking up object: %s', id);

		getService()
			.then(s=> s.getParsedObject(id))
			.then(o=> {
				this.setState({object: filter(o)});
				return o;
			})
			.then(resolve)
			.then(p=> path.join(this.getBasePath(), p))
			.then(location => this.setState({location}))
			.catch(error => {

				if (ContentAcquirePrompt.shouldPrompt(error)) {
					return this.setState({prompt: error});
				}

				if (error.statusCode === 403) {
					return this.setState({forbid: error});
				}

				return Promise.reject(error);
			})
			.catch(error => {
				logger.error('Could not resolve: %o', error);
				this.setState({error});
			});
	},


	render () {
		let {location, error, forbid, prompt, object} = this.state;
		return location ? (
			<Redirect location={location}/>
		) : forbid ? (
			<NotFound code={403} message="You do not have access to this content."/>
		) : error ? (
			<NotFound/>
		) : prompt ? (
			<ContentAcquirePrompt data={prompt} relatedItem={object}/>
		) : (
			<Loading />
		);
	}
});
