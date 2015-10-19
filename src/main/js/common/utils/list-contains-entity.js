export default function listContainsEntity (list, entity) {
	return (list || []).findIndex((user) => user.getID && user.getID() === entity.getID()) > -1;
}
