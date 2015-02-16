import {isNTIID} from 'dataserverinterface/utils/ntiids';

import {Dom} from 'common/Utils';

let {hasClass, getEventTarget} = Dom;

export default {

	onContentClick (e) {
		var anchor = getEventTarget(e, 'a[href]');
		var href, scrollToEl, fn, id, frag;
		if (anchor) {
			if (getEventTarget(e, 'widget')) {
				//click originated inside a content widget. Let go and trust it does the "right thing".
				return;
			}

			//anchor.getAttribute('href') is different than anchor.href...
			//The property on the anchor is the FULLY RESOLVED `href`, where the
			//attribute value is the raw source...thats the one we want to compare.
			href = anchor.getAttribute('href') || '';

			if (href.charAt(0) !== '#') {
				//This seems to work...if this doesn't open the link into a new
				//tab/window for IE/Firefox/Safari we can add this attribute after
				//the component updates.
				anchor.setAttribute('target', '_blank');
			}
			else if (hasClass(anchor, 'ntiglossaryentry')) {
				anchor.setAttribute('href', location.href + 'glossary/' + href.substr(1));
				return;
			}
			else {
				e.preventDefault();
				id = href.substr(1);
				scrollToEl = document.getElementById(id) || document.getElementsByName(id)[0];
				if (!scrollToEl) {
					if (id) {
						console.warn('Link (%s) refers to an element not found by normal means on the page.', href);
					}
				} else {
					fn = scrollToEl.scrollIntoViewIfNeeded || scrollToEl.scrollIntoView;
					if (fn) {
						fn.call(scrollToEl, true);
					} else {
						console.warn('No function to scroll... pollyfill time');
					}
				}
				return;
			}

			href = href.split('#');
			id = href[0];
			frag = href[1];

			if (isNTIID(id)) {
				e.preventDefault();
			}
		}
	}
};
