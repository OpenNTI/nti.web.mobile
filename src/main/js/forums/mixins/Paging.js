import { getConfig } from '@nti/web-client';

let pageSize;

const mixin = {
	currentPage() {
		const search = new URLSearchParams(global.location?.search);
		const page = search.get('p') || search.get('page') || 1;

		return parseInt(page, 10);
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
