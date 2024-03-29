import { join } from 'path';

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { decodeFromURI } from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';
import { Loading, Mixins } from '@nti/web-commons';
import { getService } from '@nti/web-client';
import ContentAcquirePrompt from 'internal/catalog/components/ContentAcquirePrompt';
import NotFound from 'internal/notfound/components/View';
import Redirect from 'internal/navigation/components/Redirect';

import { resolve } from '../resolvers';

const logger = Logger.get('object-resolver:components:View');

const filter = o =>
	o && o.MimeType === 'application/vnd.nextthought.change' && o.Item
		? o.Item
		: o;

export default createReactClass({
	displayName: 'ObjectResolver',
	mixins: [Mixins.BasePath],

	propTypes: {
		objectId: PropTypes.string.isRequired,
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		this.resolveObject(this.props.objectId);
	},

	componentDidUpdate(prevProps, prevState) {
		let { objectId } = this.props;
		if (prevProps.objectId !== objectId) {
			this.resolveObject(objectId);
		}
	},

	resolveObject(id) {
		id = decodeFromURI(id);
		logger.debug('Looking up object: %s', id);

		getService()
			.then(service =>
				// getObject() needs to fulfill on 404s that have an model body, so to ensure we reject here,
				// we will make a head request that will reject for us, then we can fetch the object.
				service
					.head(service.getObjectURL(id))
					.then(() => service.getObject(id))
			)
			.then(filter)
			.then(object => (this.setState({ object }), object))
			.then(resolve)
			.then(path => join(this.getBasePath(), path))
			.then(location => this.setState({ location }))
			.catch(error => {
				if (ContentAcquirePrompt.shouldPrompt(error)) {
					return this.setState({ prompt: error });
				}

				if (error.statusCode === 403) {
					return this.setState({ forbid: error });
				}

				return Promise.reject(error);
			})
			.catch(error => {
				logger.error('Could not resolve: %o', error);
				this.setState({ error });
			});
	},

	render() {
		let { location, error, forbid, prompt, object } = this.state;
		return location ? (
			<Redirect location={location} />
		) : forbid ? (
			<NotFound
				code={403}
				message="You do not have access to this content."
			/>
		) : error ? (
			<NotFound />
		) : prompt ? (
			<ContentAcquirePrompt data={prompt} relatedItem={object} />
		) : (
			<Loading.Mask />
		);
	},
});
