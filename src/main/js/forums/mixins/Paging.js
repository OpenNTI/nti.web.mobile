import QueryString from 'query-string';

const pageSize = 2;

module.exports = {
	currentPage() {
		let loc = global.location || {};
		let cp = parseInt(QueryString.parse(loc.search).p || 1);
		console.debug('currentPage: %d', cp);
		return cp;
	},

	get pageSize() {
		return pageSize;
	},

	batchStart() {
		return this.pageSize * (this.currentPage() - 1);
	},

	get numPages() {
		return ((this.state || {}).itemContents || {}).FilteredItemCount / this.pageSize;
	},

	hasNextPage() {
		return this.numPages > (this.currentPage());
	},

	pagingInfo() {
		return {
			currentPage: this.currentPage,
			pageSize: this.pageSize,
			hasNext: this.hasNextPage,
			hasPrevious: this.currentPage > 1
		};
	}

};
