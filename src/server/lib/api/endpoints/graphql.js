import graphQLHTTP from 'express-graphql';
import Schema from '../../../schema';

export default function register (api, config) {
	api.use(/^\/graphql\//, graphQLHTTP(request => ({
		schema: Schema,
		pretty: true,
		rootValue: {config, request}
	})));
}
