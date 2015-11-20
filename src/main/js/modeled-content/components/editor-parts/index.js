import Unknown from './Unknown';

//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /Icon.js(x?)$/
const req = require.context('./', false, /Icon.js(x?)$/);
const Icons = req.keys().map(m => req(m).default);

export default function selectIcon (data) {
	let result = Unknown;

	for (let Type of Icons) {
		if (Type && typeof Type.handles === 'function' && Type.handles(data)) {
			result = Type;
			break;
		}
	}

	return result;
}
