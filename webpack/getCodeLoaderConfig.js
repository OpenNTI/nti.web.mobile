/*eslint no-var: 0 strict: 0*/
'use strict';

var path = require('path');

var NodeModulesThatNeedCompiling = [
	'react-editor-component',
	'nti\\..+'
];


function isOurModule (s) {
	var ourprojects = NodeModulesThatNeedCompiling.join('|');
	var ours = new RegExp(ourprojects);

	var dir = path.resolve(__dirname, '..');

	if(s.indexOf(dir) === 0) {
		s = s.substr(dir.length);
	}

	if (ours.test(s)) {
		//ignore node_modules in our libraries
		s = s.split(new RegExp('(' + ourprojects + ')/node_modules')).pop();
		//still ours?
		return ours.test(s);
	}
	return false;
}


function excludeNodeModulesExceptOurs (s) {
	if (/(node_modules|resources\/vendor)/.test(s)) {
		return !isOurModule(s);
	}
	return false;
}

module.exports = exports = function getCodeLoaderConfig (test, loader) {
	return {
		test: test,
		loader: (loader ? loader + '!' : '')
			+ 'babel?optional[]=runtime&plugins[]=' + path.resolve(__dirname, 'plugins/relay'),
		exclude: excludeNodeModulesExceptOurs
	};
};


exports.isOurModule = isOurModule;
exports.excludeNodeModulesExceptOurs = excludeNodeModulesExceptOurs;
