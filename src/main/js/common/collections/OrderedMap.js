'use strict';

function OrderedMap() {
	this.keys = [];
	this.records = {};
}

OrderedMap.prototype.set = function(key, val) {
	var idx = this.keys.indexOf(key);
	if (idx > -1) {
		// remove existing key
		this.keys.splice(idx, 1);
	}
	this.keys.push(key);
	this.records[key] = val;
};

OrderedMap.prototype.get = function(key) {
	return this.records[key];
};

OrderedMap.prototype.remove = function(key) {
	this.__removeKey(key);
	delete this.records[key];
};

OrderedMap.prototype.values = function() {
	return this.keys.map(function(k) {
		return this.records[k];
	}.bind(this));
};

OrderedMap.prototype.__removeKey = function(key) {
	var idx = this.keys.indexOf(key);
	if (idx > -1) {
		return this.keys.splice(idx, 1);
	}
	return null;
};

OrderedMap.prototype.last = function() {
	var k = this.keys[this.keys.length - 1];
	return this.records[k];
};

module.exports = OrderedMap;
