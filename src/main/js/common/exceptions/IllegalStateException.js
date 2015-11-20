import ExtendBuiltin from '../utils/extend-builtin';

export default class IllegalStateException extends ExtendBuiltin(Error) {
	constructor (message) {
		super(message || 'Illegal State. No message provided.');
	}
}
