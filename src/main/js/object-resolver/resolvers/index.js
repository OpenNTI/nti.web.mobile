 //`require.context` is a little WebPack magic :) --- dynamicly require all files here
const req = require.context('./', false, /^((?!index).)*\.js$/);
const handlers = req.keys().map(req);


export function getHandler (o) {

	for (let handler of handlers) {
		if (handler.handles && handler.handles(o)) {
			return handler;
		}
	}

}


export function resolve (object) {
	let handler = getHandler(object);
	if (!handler) {
		console.warn('No Handler for object: ', object);
		return Promise.resolve('/');
	}

	return handler.resolve(object);
}
