export default {
	getMembers (entity, includeCreator=true) {
		let entities = ((entity || {}).friends || []).slice();
		if (includeCreator && entity.creator) {
			entities.push(entity.creator);
		}
		return entities;
	}
};

// callback function passed to AvatarGrid for marking group creators as admins with a css class.
export function classesFor (creator, user) {
	let name = typeof user === 'string' ? user : (user || {}).getID();
	return name === creator ? 'group-admin' : null;
}
