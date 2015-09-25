import {
	fromGlobalId,
	nodeDefinitions
} from 'graphql-relay';

const registry = [];


export function registerType (type, isType = ()=> false, getObject = (id, svc)=> svc.getParsedObject(id)) {
	registry.push({type, isType, getObject});
}

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 *
 * The second defines the way we resolve an object to its GraphQL type.
 */
export const {nodeInterface, nodeField} = nodeDefinitions(

	//Get the getter for a type from Relay's GlobalId...
	(globalId, info) => {

		let {type, id} = fromGlobalId(globalId);
		let data = registry.find(x => x.type.name === type);
		return data
			? data.getObject(id, info.rootValue.service)
			: null;
	},

	//Map object instance to it's schema type...
	(obj) => {
		let data = registry.find(x => x.isType(obj));
		return data
			? data.type
			: null;
	}
);
