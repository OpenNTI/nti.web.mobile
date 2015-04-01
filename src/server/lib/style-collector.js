'use strict';
/*eslint no-var: 0*/
function StyleCollector() {}

var me = StyleCollector.prototype;

me.add = function() {
	console.warn('!!!! CSS not collected, expect to see a flash of unstyled UI');
};

me.collect = function(fn) {
	var stuff = [];

	this.add = stuff.push.bind(stuff);

	fn();

	delete this.add;
	return stuff.join('\n');
};


module.exports = exports = new StyleCollector();
