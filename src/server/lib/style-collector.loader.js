/*eslint no-var: 0 strict: 0*/
'use strict';
exports = module.exports = function StyleLoader() {};
exports.pitch = function pitch (req) {
	this.cacheable();
	return 'require(' + JSON.stringify(require.resolve('./style-collector')) +
		').add(require(' + JSON.stringify('!!' + req) + '));\n' +
		'delete require.cache[module.id];';
};
