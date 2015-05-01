function hyphenatedToCamel (s) {
	let re = hyphenatedToCamel.re = (hyphenatedToCamel.re || /-([a-z])/g);
	return s.replace(re, g=>g[1].toUpperCase());
}


function addValueFor(o, n, v) {
	let re = addValueFor.re = (addValueFor.re || /^data([A-Z])/);
	//Creating a function without scope chain
	let fn = addValueFor.fn = (addValueFor.fn || new Function('m, a', 'return a.toLowerCase();'));//eslint-disable-line no-new-func
	if (re.test(n)) {
		n = n.replace(re, fn);
		o.dataset = (o.dataset || {});
		o = o.dataset;
	}


	let c = o[n]; o[n] = c ? (Array.isArray(c) ? c : [c]).concat(v) : v;
}


function getDirectChildNodes(el, tag) {
	tag = tag.toUpperCase();
	return Array.from(el.childNodes).filter(node => node.nodeName.toUpperCase() === tag);
}


export default function parseDomObject (el) {
	let obj = {};
	let prefix = '';

	Array.from(el.attributes).forEach(p => {
		addValueFor(obj,
			hyphenatedToCamel(prefix + p.name),
			p.value);
	});

	getDirectChildNodes(el, 'param').forEach(p => addValueFor(obj, p.name, p.value));

	obj.children = getDirectChildNodes(el, 'object').map(p => parseDomObject(p));
	if (obj.children.length === 0) {
		delete obj.children;
	}

	Object.defineProperty(obj, 'dom', {
		value: el.cloneNode(true)
	});

	return obj;
}
