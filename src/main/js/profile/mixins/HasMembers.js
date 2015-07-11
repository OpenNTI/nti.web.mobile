export default {
	getMembers (entity) {
		let entities = ((entity || {}).friends || []).slice();
		if (entity.creator) {
			entities.push(entity.creator);
		}
		return entities;
	}
};

// callback function passed to AvatarGrid for marking group creators as admins with a css class.
export function classesFor(creator, user) {
	let name = typeof user === 'string' ? user : (user || {}).username;
	return name === creator ? 'group-admin' : null;
}
