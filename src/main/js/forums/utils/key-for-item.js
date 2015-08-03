import hash from 'object-hash';

export default function (item) {
	return item.getID ? item.getID() : hash(item);
}
