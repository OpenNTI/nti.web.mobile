import {getWidth as getViewportWidth, getHeight as getViewportHeight} from './viewport';

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
