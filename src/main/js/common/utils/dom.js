import {getWidth as getViewportWidth, getHeight as getViewportHeight} from './viewport';

import isEmpty from 'dataserverinterface/utils/isempty';

import between from 'dataserverinterface/utils/between';

import withValue from 'dataserverinterface/utils/object-attribute-withvalue';

function hyphenatedToCamel (s) {
	var re = hyphenatedToCamel.re = (hyphenatedToCamel.re || /-([a-z])/g);
	return s.replace(re, g=>g[1].toUpperCase());
}


export function isMultiTouch  (e) {
	return e.touches && e.touches.length > 1;
}


export function isPointWithIn  (el,...point) {
	var rect,
		{x, y} = point[0];

	if (point.length > 1) {
		x = point[0];
		y = point[1];
	}

	rect = getElementRect(el);

	return (
		between(x, rect.left, rect.right) &&
		between(y, rect.top, rect.bottom)
	);
}


export function getElementRect  (el) {
	var rect, w, h;
	if (el && el.getBoundingClientRect) {
		rect = el.getBoundingClientRect();
	}

	if (!rect && el) {
		if (el.nodeType !== Node.ELEMENT_NODE) {
			//
			h = getViewportHeight();
			w = getViewportWidth();
			rect = {
				top: 0, left: 0,
				right: w, bottom: h,
				width: w, height: h
			};
		}
		// else {
		// 	rect = {
		// 		top: el.offsetTop,
		// 		left: el.offsetLeft,
		// 		bottom: el.offsetTop + el.offsetHeight,
		// 		right: el.offsetLeft + el.offsetWidth,
		// 		width: el.offsetWidth,
		// 		height: el.offsetHeight
		// 	};
		// }
	}

	return rect;
}


export function scrollElementBy  (el, x, y) {
	x = x||0;
	y = y||0;


	if (el.scrollBy) {
		return el.scrollBy(x, y);
	}

	return window.scrollBy(x, y);
}


export function getScrollPosition  (el) {
	if (el.scrollTop == null) {
		el = document.body;
	}
	return {
		top: el.scrollTop,
		left: el.scrollLeft
	};
}


export function addEventListener  (el, event, handler) {
	if (el.addEventListener) {
		el.addEventListener(event, handler, true);
	}

	else if (el.attachEvent) {
		el.attachEvent('on' + event, handler);
	}

	else {
		throw new Error('Unsupported Operation');
	}
}


export function removeEventListener  (el, event, handler) {
	if (el.removeEventListener) {
		el.removeEventListener(event, handler, true);
	}

	else if (el.detachEvent) {
		el.detachEvent('on' + event, handler);
	}

	else {
		throw new Error('Unsupported Operation');
	}
}


export function hasClass (el, className) {
	var classes = (el.className || '').split(' ');
	return classes.indexOf(className) !== -1;
}


export function addClass  (el, className) {
	if (el.classList) {
		return el.classList.add(className);
	}

	var classes;
	if (!hasClass(el, className)) {
		classes = (el.className || '').split(' ');
		classes.push(className);
		el.className = classes.join(' ');
	}
}


export function removeClass  (el, className) {
	if (el.classList) {
		return el.classList.remove(className);
	}

	var classes;
	if (hasClass(el, className)) {
		classes = (el.className || '').split(' ');
		classes.splice(classes.indexOf(className), 1);
		el.className = classes.join(' ');
	}
}


export function matches(el, selector) {
	var fn = matches.nativeFn;
	if(fn === undefined) {
		//Figure out what the native function is called... (if any)
		// If non, it should set it to 'null' and prevent the above
		// strict equality from passing in the future.
		fn = matches.nativeFn = [
			'matches',
			'webkitMatchesSelector',
			'mozMatchesSelector',
			'msMatchesSelector'
		].reduce((fn, name) => {
				return fn || (el[name] && name) || null; }, null);
	}

	if (fn) {
		return el[fn](selector);
	}

	//In the fallback case, and there happens to be no `parentNode`... we're screwed. :|
	//Maybe create a DocumentFragment and append el to that and use that as the parent?
	return !!Array.from(el.parentNode.querySelectorAll(selector))
		.reduce((match, potential) => {
			return match || (el === potential && potential);
		});
}


/**
 * Much like the Sencha ExtJS EventObject.getTarget() method. This will
 * resolve an event target based on the selector.  If the selector does
 * not match it will not return anything. If no selector is given, it will
 * simply return the target.(normalized)
 *
 * @param {Event} event    The browser/synthetic event. (Must have a
 *                         `target` property to used duck-typed)
 * @param {String} selector A CSS selector.
 */
export function getEventTarget (event, selector) {
	var t = event.target || event.srcElement;
	if (t && t.nodeType === Node.TEXT_NODE) {
		t = t.parentNode;
	}

	if (t && !isEmpty(selector)) {
		while(t.parentNode && !matches(t, selector)) {
			t = t.parentNode;
		}
	}

	//this will return null for any node/falsy value of t where t's NodeType
	// is not an Element.
	return (t && t.nodeType === Node.ELEMENT_NODE && t) || null;
}


export function filterNodeList (nodeList, filter) {
	var d = Array.from(nodeList);

	if (typeof filter === 'string') {
		filter = this[filter];
	}

	return d.filter(filter);
}


export function parentElements  (el) {
	var parents = [], p;

	while(el) {
		el = p = el.parentNode;
		if(p && p.nodeType === Node.ELEMENT_NODE) {
			parents.push(p);
		}
	}

	return parents;
}


export function getStyle  (el, property) {
	var getStyles = x => {
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements (see jQuery source)
		if ( x.ownerDocument.defaultView.opener ) {
			return x.ownerDocument.defaultView.getComputedStyle( x, null );
		}
		return global.getComputedStyle( x, null );
	};

	var styles = getStyles(el);

	return styles && styles[property];
}


export function scrollParent (el) {
	//Inspired by jQuery#scrollParent
	var position = getStyle(el, 'position' );
	var excludeStaticParent = position === 'absolute';
	var css = getStyle.bind(this);
	var allowsOverflow = /(auto|scroll)/;
	var viewport = el.ownerDocument || document;

	function overflowed(parent) {
		if (excludeStaticParent && css(parent, 'position' ) === 'static') {
			return false;
		}

		return allowsOverflow.test(
			css(parent, 'overflow' ) +
			css(parent, 'overflow-y' ) +
			css(parent, 'overflow-x' )
		);
	}

	var scrollParent = position !== 'fixed' && parentElements(el).filter(overflowed);

	return (!scrollParent || !scrollParent.length) ? viewport : scrollParent[0];
}


export function isRootObject(e) {
	var p = e.parentNode;
	if (p && p.nodeName === 'OBJECT') { return false; }
	return p ? isRootObject(p) : true;
}


export function parseDomObject (el, attributePrefix) {
	var obj = {};
	var prefix = isEmpty(attributePrefix, true) ?
				'' : attributePrefix;

	Array.from(el.attributes).forEach(p => {
		__addValue(obj,
			hyphenatedToCamel(prefix + p.name),
			p.value);
	});

	__directChildNodes(el, 'param').forEach(p => __addValue(obj, p.name, p.value));

	// SAJ: Does not work as intent and just wastes CPU cycles.
	// __directChildNodes(el, 'object').forEach(p=>parseDomObject(p));


	Object.defineProperty(obj, 'dom', withValue(el.cloneNode(true)));

	return obj;
}


export function getVideosFromDom (contentElement) {
	var videoQS = 'object .naqvideo, object .ntivideo',
		sourceQS = 'object[type$=videosource]',
		videoObjects = [];

	if (contentElement) {
		Array.from(contentElement.querySelectorAll(videoQS)).forEach(v => {
			var o = parseDomObject(v),
				s = o.sources = [];

			Array.from(v.querySelectorAll(sourceQS)).forEach(source =>
				s.push(parseDomObject(source)));

			videoObjects.push(o);
		});
	}

	return videoObjects;
}


export function getImagesFromDom (contentElement) {
	var imageObjects = [];

	Array.from(contentElement.querySelectorAll('span > img')).forEach(i =>
		imageObjects.push(parseDomObject(i)));
	return imageObjects;
}


/* CU: A function that adjust links displayed to the user.
 * Note this is different then any content reference cleanup that happens
 * when content loads. Right now the purpose is to detect links that are
 * external (absolute and aren't the same base path) and set their target
 * to _blank.  The base url check allows us to just do fragment navigation
 * in the same tab so if people get clever and insert links to things like
 * profile we do the right thing.
 */
export function retargetAnchorsWithExternalRefs (markup, baseUrl) {
	var string = (typeof markup === 'string'),
		tempDom;

	if (!markup) {
		return;
	}

	if (string) {
		tempDom = document.createElement('div');
		tempDom.innerHTML = markup;
		markup = tempDom;
	}

	Array.from(markup.querySelectorAll('a[href]')).forEach(link => {
		var href = link.href || '',
			base = baseUrl.split('#')[0],
			changeTarget = href.indexOf(base) !== 0;

		if (changeTarget) {
			link.setAttribute('target', '_blank');
		}
	});

	return string ? markup.innerHTML : markup;
}


export function isEmpty(value) {
	var re = (isEmpty.re || /((&nbsp;)|(\u2060)|(\u200B)|(<br\/?>)|(<\/?div>))*/ig);

	isEmpty.re = re;

	value = (Array.isArray(value) && value.join('')) || String(value);

	return value.replace(re, '') === '';
}


/**
 * Replace a node in the DOM Tree
 *
 * @param {Element} oldNode The node that will be replaced.
 * @param {Element} [newNode] The node to replace the with.
 * @returns {Element} The node that was replaced.
 */
export function replaceNode (oldNode, newNode) {
	var parentNode = oldNode && oldNode.parentNode;
	if (!parentNode) {
		throw new Error('Invalid Arguments');
	}

	if(newNode) {
		parentNode.insertBefore(newNode, oldNode);
	}

	parentNode.removeChild(oldNode);
	return oldNode;
}


export function removeNode (el) {
	var p = el && el.parentNode;
	if (p) {
		p.removeChild(el);
	}
}


/**
 * @param {String|Node} html
 * @return {String}
 */
export function sanitizeExternalContentForInput (html) {
	console.debug('Sanitizing html...', html);
	//html = html.trim().replace(/[\n\r]+/g, ' ');

	var offScreenBuffer = document.createElement('div'),
		toRemove, i;

	if (typeof html === 'string') {
		offScreenBuffer.innerHTML = html.replace(/[\n\r]+/ig, ' ');
	} else {
		offScreenBuffer.appendChild(html.cloneNode(true));
	}

	toRemove = __pickUnsanitaryElements(offScreenBuffer, true);

	//Data gathered, do the remove (in reverse)
	for (i = toRemove.length - 1; i >= 0; i--) {
		__removeNodeRecursively(toRemove[i]);
	}

	//get the new html content...
	html = offScreenBuffer.innerHTML;
	offScreenBuffer.innerHTML = ''; //free up
	return html;//return;
}


export function enforceNumber (e) {
	function between(key, lower, upper) {
		return lower <= key && key <= upper;
	}

	var input = e.target,
		maxLength = parseInt(input.getAttribute('size'), 10) || -1,
		tooLong = (input.value || '').length + 1 > maxLength,

		letter = e.charCode || 13,
		isArrow = between(letter, 37, 40),//left arrow, and down arrow
		isNumber = between(letter, 48, 57) || between(letter, 95, 105),//numbers across the top and num pad
		isAllowedCtrl = between(letter, 8, 9) || letter === 13, //backspace, tab, or enter
		hasSelection = Math.abs(input.selectionStart - input.selectionEnd) !== 0,
		ctrlPressed = e.ctrlKey; //ext maps the metaKey to ctrlKey

	// if the character entered is
	//	1.) pushing the size of the input value over the limit, there is a
	//		size limit, and the character is a number, and there is no
	//		selection or
	//	2.) not an arrow, number, or allowed control key and
	//	3.) the ctrl or meta key is not pressed then stop the event and do
	//		not put the character in the input
	if (!ctrlPressed &&
		((maxLength >= 0 && tooLong && isNumber && !hasSelection) ||
		!(isArrow || isNumber || isAllowedCtrl))) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
}


function __addValue(o, n, v) {
	var re = __addValue.re = (__addValue.re || /^data([A-Z])/);
	/* jshint -W054 *///Creating a function without scope chain
	var fn = __addValue.fn = (__addValue.fn || new Function('m, a', 'return a.toLowerCase();'));
	if (re.test(n)) {
		n = n.replace(re, fn);
		o.dataset = (o.dataset || {});
		o = o.dataset;
	}


	var c = o[n]; o[n] = c ? (Array.isArray(c) ? c : [c]).concat(v) : v;
}



function __directChildNodes(el, tag) {
	tag = tag.toUpperCase();
	return Array.from(el.childNodes).filter(node => node.nodeName.toUpperCase() === tag);
}



/**
 * Select the nodes we might want to remove.
 *
 * WARNING: this will MODIFY children of `root` if `cleanAttributes` is true.
 *
 * @param {Node} root - Root Node to select unwanted elements
 * @param {Boolean} cleanAttributes - if true, will remove all attributes that
 *                                    are not white listed. (See KEEP_ATTRS)
 * @return {Node[]}
 * @private
 */
function __pickUnsanitaryElements (root, cleanAttributes) {
	var namespaced = /:/,
		picked = [], tw, name, value, el, i,
		notJs = /^(?!javascript:).*/i,
		present = /.*/,
		KEEP_ATTR_IF = {
			style: present,
			href: notJs,
			src: notJs
		},
		BAD_NODES = {
			LINK: 1, STYLE: 1, META: 1, TITLE: 1, HEAD: 1,
			SCRIPT: 1, OBJECT: 1, EMBED: 1, APPLET: 1
		};
	/* jshint -W016*/
	tw = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT, null, false);
	do {
		el = tw.nextNode();
		if (!el) {continue;}

			//Remove comments
		if ((el.nodeType === Node.COMMENT_NODE) ||
			//remove nodes we deem bad
			(BAD_NODES[el.tagName]) ||
			//remove empty nodes (maybe dangerous, images?, is there a way to know if an element is meant to be unary?)
			//allow img and br tags
			(el.childNodes.length === 0 && !/^(IMG|BR)$/i.test(el.tagName)) ||
			/* jshint -W101 */
			//remove elements that are effectively empty (whitespace only text node as their only child)
			(el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.childNodes[0].nodeValue.trim() === '') ||
			/* jshint +W101 */
			//remove Office (xml namespaced) elements (that are empty)... need an would be nice to just
			// find all patterns <(/?)FOO:BAR( ...?)> and delete them and leave the content they surround.
			(namespaced.test(el.tagName) && el.childNodes.length === 0)) {

			picked.push(el);

		} else if (cleanAttributes) {
			//Clean attributes of elements we will not remove
			i = el.attributes.length - 1;
			for (i; i >= 0; i--) {
				name = el.attributes[i].name;
				value = el.getAttribute(name);
				if (!KEEP_ATTR_IF[name] || !KEEP_ATTR_IF[name].test(value)) {
					el.removeAttribute(name);
				}
			}
		}
	} while (el);

	return picked;
}



/**
 * recursively remove an elment (if removing a node produces an empty parent
 * node, remove it too...until we get to the root)
 *
 * @param {Node} el
 * @private
 */
function __removeNodeRecursively(el) {
	var pn = el && el.parentNode;
	if (!pn) {return;}
	pn.removeChild(el);
	if (pn.childNodes.length === 0) {
		__removeNodeRecursively(pn);
	}
}
