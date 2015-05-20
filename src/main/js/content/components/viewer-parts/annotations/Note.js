import Highlight from './Highlight';

export default class Note extends Highlight {
	static handles (item) {
		return /note$/i.test(item.MimeType);
	}
}
