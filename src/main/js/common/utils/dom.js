import {getWidth as getViewportWidth, getHeight as getViewportHeight} from './viewport';

import between from 'nti.lib.interfaces/utils/between';





export function isMultiTouch (e) {
	return e.touches && e.touches.length > 1;
}


export function isPointWithIn (el, ...point) {
	let rect,
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


export function getElementRect (el) {
	let rect, w, h;
	if (el && el.getBoundingClientRect) {
		rect = el.getBoundingClientRect();
	}

	if (!rect && el) {
		if (el.nodeType !== 1/*Node.ELEMENT_NODE*/) {
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


export function scrollElementBy (el, x, y) {
	x = x || 0;
	y = y || 0;


	if (el.scrollBy) {
		return el.scrollBy(x, y);
	}

	return window.scrollBy(x, y);
}


export function getScrollPosition (el) {
	if (el.scrollTop == null) {
		el = document.body;
	}
	return {
		top: el.scrollTop,
		left: el.scrollLeft
	};
}


export function addEventListener (el, event, handler) {
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


export function removeEventListener (el, event, handler) {
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


export function filterNodeList (nodeList, filter) {
	let d = Array.from(nodeList);

	if (typeof filter === 'string') {
		//Predefined filter by name

		//filter = this[filter];
		throw new Error('Not Implemented');
	}

	return d.filter(filter);
}


export function parentElements (el) {
	let parents = [], p;

	while(el) {
		el = p = el.parentNode;
		if(p && p.nodeType === 1/*Node.ELEMENT_NODE*/) {
			parents.push(p);
		}
	}

	return parents;
}


export function getStyle (el, property) {
	let getStyles = x => {
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements (see jQuery source)
		if ( x.ownerDocument.defaultView.opener ) {
			return x.ownerDocument.defaultView.getComputedStyle( x, null );
		}
		return global.getComputedStyle( x, null );
	};

	let styles = getStyles(el);

	return styles && styles[property];
}


export function scrollParent (el) {
	//Inspired by jQuery#scrollParent
	let position = getStyle(el, 'position' );
	let excludeStaticParent = position === 'absolute';
	let css = getStyle.bind(this);
	let allowsOverflow = /(auto|scroll)/;
	let viewport = el.ownerDocument || document;

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

	let scrollingEl = position !== 'fixed' && parentElements(el).filter(overflowed);

	return (!scrollingEl || !scrollingEl.length) ? viewport : scrollingEl[0];
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
	let string = (typeof markup === 'string'),
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
		let href = link.href || '',
			base = baseUrl.split('#')[0],
			changeTarget = href.indexOf(base) !== 0;

		if (changeTarget) {
			link.setAttribute('target', '_blank');
		}
	});

	return string ? markup.innerHTML : markup;
}


/**
 * @param {string|Node} html Un-tamed wild markup.
 * @returns {string} html
 */
export function sanitizeExternalContentForInput (html) {
	console.debug('Sanitizing html...', html);
	//html = html.trim().replace(/[\n\r]+/g, ' ');

	let offScreenBuffer = document.createElement('div'),
		toRemove, i;

	if (typeof html === 'string') {
		offScreenBuffer.innerHTML = html.replace(/[\n\r]+/ig, ' ');
	} else {
		offScreenBuffer.appendChild(html.cloneNode(true));
	}

	toRemove = pickUnsanitaryElements(offScreenBuffer, true);

	//Data gathered, do the remove (in reverse)
	for (i = toRemove.length - 1; i >= 0; i--) {
		removeNodeRecursively(toRemove[i]);
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

	let input = e.target,
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


/**
 * Select the nodes we might want to remove.
 *
 * WARNING: this will MODIFY children of `root` if `cleanAttributes` is true.
 *
 * @param {Node} root - Root Node to select unwanted elements
 * @param {boolean} cleanAttributes - if true, will remove all attributes that
 *                                    are not white listed. (See KEEP_ATTRS)
 * @return {Node[]} Array of Nodes
 * @private
 */
function pickUnsanitaryElements (root, cleanAttributes) {
	let namespaced = /:/,
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

	tw = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT, null, false);// eslint-disable-line no-bitwise
	do {
		el = tw.nextNode();
		if (!el) { continue; }

			//Remove comments
		if ((el.nodeType === Node.COMMENT_NODE) ||
			//remove nodes we deem bad
			(BAD_NODES[el.tagName]) ||
			//remove empty nodes (maybe dangerous, images?, is there a way to know if an element is meant to be unary?)
			//allow img and br tags
			(el.childNodes.length === 0 && !/^(IMG|BR)$/i.test(el.tagName)) ||
			//remove elements that are effectively empty (whitespace only text node as their only child)
			(el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && el.childNodes[0].nodeValue.trim() === '') ||
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
 * @param {Node} el element to remove
 * @return {void}
 * @private
 */
function removeNodeRecursively(el) {
	let pn = el && el.parentNode;
	if (!pn) { return; }
	pn.removeChild(el);
	if (pn.childNodes.length === 0) {
		removeNodeRecursively(pn);
	}
}
