export default class IllegalStateException extends Error {
	constructor (message) {
		super(message || 'Illegal State. No message provided.');
	}
}
