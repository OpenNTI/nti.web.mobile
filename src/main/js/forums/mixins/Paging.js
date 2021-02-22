import QueryString from 'query-string';
import { getConfig } from '@nti/web-client';

let pageSize;

const mixin = {
	currentPage() {
		let loc = global.location || {};
		let search = QueryString.parse(loc.search);

		let cp = parseInt(search.p || search.page || 1, 10);
		return cp;
	},

	getPageSize() {
		if (pageSize == null) {
			pageSize = getConfig('discussions').pageSize || 20;
		}
		return pageSize;
	},

	batchStart() {
		return this.getPageSize() * (this.currentPage() - 1);
	},

	numPages() {
		return Math.ceil(
			(((this.state || {}).itemContents || {}).FilteredTotalItemCount ||
				0) / this.getPageSize()
		);
	},

	hasNextPage() {
		return this.numPages() > this.currentPage();
	},

	pagingInfo() {
		return {
			currentPage: this.currentPage,
			pageSize: this.getPageSize(),
			numPages: this.numPages(),
			hasNext: this.hasNextPage(),
			hasPrevious: this.currentPage() > 1,
		};
	},
};

export default mixin;

export function compose(Cmp) {
	Object.assign(Cmp.prototype, mixin);
	return Cmp;
}
