export default {
	getMembers (entity) {
		let entities = ((entity || {}).friends || []).slice();
		if (entity.creator) {
			entities.push(entity.creator);
		}
		return entities;
	}
};
