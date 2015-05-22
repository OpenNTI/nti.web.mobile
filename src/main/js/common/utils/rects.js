import {getWidth as getViewportWidth, getHeight as getViewportHeight} from './viewport';

const isNumber = x => typeof x === 'number' && isFinite(x);
const isObject = x => x != null && typeof x === 'object' && x.ownerDocument === undefined;

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


export function getFirstNonBoundingRect (range) {
	range = range.nativeRange || range;
	let bound = range.getBoundingClientRect();
	let rects = Array.from(range.getClientRects());


	//trim the empty ones
	for (let i = rects.length - 1; i >= 0; i--) {
		let r = rects[i];
		if (!r.height || !r.width) { rects.splice(i, 1); }
	}

	for (let i = 0; i < rects.length; i++) {
		let r = rects[i];
		if (r && (r.top !== bound.top ||
			r.bottom !== bound.bottom ||
			r.left !== bound.left ||
			r.right !== bound.right)) {
			return r;
		}
	}

	return bound;
}


export function merge (rects, clientWidth) {
	rects = Array.from(rects);
	let results = [];
	let bins = {};
	let heights = [17, 24] //Sane default values for small highlights
				.conct(...rects.map(x=>x && x.height).filter(x=> x > 0));

	heights.sort((a, b) => a - b);

	//Take the 33rd percentile of nonzero highlights; this seems to
	//be a fairly good heuristic for the line height
	let lineHeight = heights[Math.floor(heights.length / 3)];

	rects = this.trimCrazies(rects, lineHeight, clientWidth);

	for (let ri of rects) {

		let x = ri.left || ri.x;
		let y = ri.top || ri.y;
		let h = ri.height || (ri.bottom - ri.top);
		let w = ri.width || (ri.right - ri.left);
		let xx = ri.right || (x + ri.height);
		let yy = ri.bottom || (y + ri.width);

		let tolerance = 8;

		let b = Math.floor((y + h / 2) / tolerance);//center line of the rect

		if (!bins[b] && !bins[b + 1]) {
			results.push({ left: x, top: y, right: xx, bottom: yy, width: w, height: h });
			//Each bin points to the rectangle occupying it,
			//+1 to overcome the problem of falsy values
			bins[b] = results.length;
			bins[b + 1] = results.length;
		}
		else {
			b = results[(bins[b] || bins[b + 1]) - 1];
			b.left = b.left < x ? b.left : x;
			b.top = b.top < y ? b.top : y;
			b.right = b.right > xx ? b.right : xx;
			b.bottom = b.bottom > yy ? b.bottom : yy;

			b.width = b.right - b.left;
			b.height = b.bottom - b.top;
		}

	}

	return results;
}


export function trimCrazies (rects, lineHeight, clientWidth) {
	rects = Array.from(rects);

	const flip = (a, i) => Object.assign({}, a[i]);

	const notTooShort = h => !lineHeight || h >= lineHeight;
	const notTooTall = h => !lineHeight || h < lineHeight * 1.9;
	const isCovered = i => rects.every(x => x.top > rects[i].top && x.bottom < rects[i].bottom);

	let out = [];

	if (!rects.length < 2 || !lineHeight /*|| isIE*/) { return rects; }

	for (let i = rects.length - 1; i >= 0; i--) {
		let o = flip(rects, i);

		if (o.height && o.height < lineHeight) {
			o.height = lineHeight; //round up to look nice
		}

		let h = o.height;
		let w = o.width;
		if (w > 0 && (w <= clientWidth || !clientWidth) && notTooShort(h) && (notTooTall(h) || !isCovered(i))) {
			out.push(o);
		}
	}

	return out;
}


export function contains (refRect, testRect, allowances) {
	let a = allowances || 0;
	if (isNumber(a)) {
		a = { top: -a, bottom: a, left: -a, right: a };
	}

	if (!isObject(a)) { throw new Error('Invalid allowances value'); }

	return (refRect.top + (a.top || 0)) <= testRect.top
		&& (refRect.bottom + (a.bottom || 0)) >= testRect.bottom
		&& (refRect.left + (a.left || 0)) <= testRect.left
		&& (refRect.right + (a.right || 0)) >= testRect.right;

}


export function isZeroRect (rect) {
	return !rect || (rect.top + rect.left + rect.height + rect.width) === 0;
}
