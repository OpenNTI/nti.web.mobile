import {isNTIID, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import {hasClass, getEventTarget} from 'nti.lib.dom';

const SCROLL = Symbol('Scroll-To-Target-Delay');

export default {

	componentWillMount () {
		this.maybeScrollToFragment();
	},

	componentWillReceiveProps () {
		this.maybeScrollToFragment();
	},

	componentDidUpdate (_, prevState) {
		if (this.state.loading !== prevState.loading) {
			this.maybeScrollToFragment();
		}
	},


	onContentClick (e) {
		let anchor = getEventTarget(e, 'a[href]');
		if (anchor) {
			if (getEventTarget(e, 'widget')) {
				//click originated inside a content widget. Let go and trust it does the "right thing".
				return;
			}

			//anchor.getAttribute('href') is different than anchor.href...
			//The property on the anchor is the FULLY RESOLVED `href`, where the
			//attribute value is the raw source...thats the one we want to compare.
			let href = anchor.getAttribute('href') || '';

			let parts = href.split('#');
			let id = parts[0];
			let frag = parts[1] || '';

			if (hasClass(anchor, 'ntiglossaryentry')) {
				this.navigate('/glossary/' + href.substr(1));
				return;
			}

			let isFragmentRef = href.charAt(0) === '#' || (frag.length && id === this.getPageID());

			if (!isFragmentRef && !isNTIID(id)) {
				//This seems to work...if this doesn't open the link into a new
				//tab/window for IE/Firefox/Safari we can add this attribute after
				//the component updates.
				anchor.setAttribute('target', '_blank');
			}

			//split if/else for readability.
			if (isFragmentRef) {
				e.preventDefault();
				id = decodeURIComponent(frag);
				if (!this.scrollToTarget(id)) {
					console.warn('Link (%s) refers to an element not found by normal means on the page.', href);
				}
				return;
			}


			//let the capture clicks widget take us to a new place...
			if (isNTIID(id)) {
				let {pageSource, page} = this.state;
				let ref = encodeForURI(id);

				href = pageSource.contains(id)
					? this.makeHref(ref) //the ID is in the pageSource... just page
					//ID is not in the pageSource, reroot:
					: page.getTableOfContents().getNode(id) != null
						? this.makeHrefNewRoot(ref)
						//ID is not in the current toc, resolve:
						: this.makeObjectHref(ref);

				anchor.setAttribute('href', href);
			}

			if (frag.length) {
				console.warn('TODO: implement navigating to a fragment on a new page.');
			}
		}
	},


	getScrollTargetIdFromHash () {
		let {hash} = location;
		return hash && decodeURIComponent(hash.substr(1));
	},


	scrollToTarget (id) {
		let scrollToEl = document.getElementById(id) || document.getElementsByName(id)[0];
		if (scrollToEl) {
			let fn = scrollToEl.scrollIntoViewIfNeeded || scrollToEl.scrollIntoView;
			if (fn) {
				fn.call(scrollToEl, true);
			} else {
				console.warn('No function to scroll... pollyfill time');
			}
			return true;
		}

		return false;
	},


	maybeScrollToFragment () {
		let {content} = this.refs;
		if (!content || !content.isMounted()) {
			return;
		}

		clearTimeout(this[SCROLL]);
		this[SCROLL] = setTimeout(()=> {
			let id = this.getScrollTargetIdFromHash();
			if (id) {
				console.debug('Scrolling to %s...', id);
				this.scrollToTarget(id);
				try {
					//SOOoooo dirty! This is removing the fragment from the address bar:
					history.replaceState(
						history.state,
						document.title,
						location.pathname);
				}
				catch (e) {} //eslint-disable-line
			}
		}, 500);
	}
};
