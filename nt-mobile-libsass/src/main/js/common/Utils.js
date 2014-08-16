"use strict";

var Utils = {
	getLink: function(o, rel) {
		if (o && o.Links) { o = o.Links; }

		var v, i = o.length - 1;
		for (i; i>=0; i--) {
			v = o[i];
			if (v && v.rel === rel) {
				return v;
			}
		}
	},
	call: function(url,data,back,forceMethod) {
		var u = data? data.username : undefined,
			p = data? data.password : undefined,
			a = p? ('Basic '+btoa(u+':'+p)) : undefined,
			m = forceMethod? forceMethod : data? 'POST':'GET',
			l = url,/* + "?dc="+(new Date().getTime()),*/
			f = { withCredentials: true },
			h = {
				Accept:'application/json',
				Authorization:a,
				'Content-Type':'application/x-www-form-urlencoded'
			};

		if(!a){ delete h.Authorization; f = {}; }
		if(!data) { delete h['Content-Type']; }

		if (m === 'GET' && data){
			delete data.password;
			delete data.remember;
			delete data.username;
		}

		var x = $.ajax({
			xhrFields: f,
			url: l,
			type: m,
			headers: h,
			data: data,
			dataType: 'json'
		}).fail(function(jqXHR, textStatus){
			//console.error('The request failed. Server up? CORS?\nURL: '+l, textStatus, jqXHR.status);
			if(back){ back.call(window, jqXHR.status ); }
		}).done(function(data){
			if(back){ back.call(window, data || x.status ); }
		});
	},
	/*
	* Maps the given object array, indexed by element[key].
	* Example:
	* var in = [{name:'banana', color:'yellow'}, {name:'apple', color:'red'}];
	* Utils.indexArrayByKey(in,'name') returns:
	* {
	* 	'banana': {name:'banana', color:'yellow'},
	* 	'apple': {name:'apple', color:'red'}
	* }
	* Note: No attempt is made to prevent items with
	* the same key from stomping each other.
	*/
	indexArrayByKey: function(arr, key) {
		var result = {};
		arr.forEach(function(item) {
			result[item[key]] = item;
		});
		return result;
	}
}

module.exports = Utils;
