let attached = false;

const isScroller = Symbol();

export default function (el) {
	if (!el) { console.error('No element given!'); return; }
	el.addEventListener('touchstart', function () {
		let top = el.scrollTop,
			totalScroll = el.scrollHeight,
			currentScroll = top + el.offsetHeight;

		//If we're at the top or the bottom of the containers
		//scroll, push up or down one pixel.
		//
		//this prevents the scroll from "passing through" to
		//the body.
		if(top === 0) {
			el.scrollTop = 1;
		} else if(currentScroll === totalScroll) {
			el.scrollTop = top - 1;
		}
	});

	el.addEventListener('touchmove', function (evt) {
		//if the content is actually scrollable, i.e. the content is long enough
		//that scrolling can occur
		if(el.offsetHeight < el.scrollHeight) {
			evt[isScroller] = true;
		}
	});

	if (!attached) {
		attached = true;

		document.body.addEventListener('touchmove', function (evt) {
			//In this case, the default behavior is scrolling the body, which
			//would result in an overflow.  Since we don't want that, we preventDefault.
			if(!evt[isScroller]) {
				evt.preventDefault();
			}
		});

	}
}
