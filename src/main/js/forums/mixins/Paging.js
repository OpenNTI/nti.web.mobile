import QueryString from 'query-string';

const pageSize = 2;

module.exports = {
	currentPage() {
		let loc = global.location || {};
		let cp = parseInt(QueryString.parse(loc.search).p || 1);
		return cp;
	},

	get pageSize() {
		return pageSize;
	},

	batchStart() {
		return this.pageSize * (this.currentPage() - 1);
	},

	numPages() {
		return (((this.state || {}).itemContents || {}).FilteredTotalItemCount || 0) / this.pageSize;
	},

	hasNextPage() {
		return this.numPages() > (this.currentPage());
	},

	pagingInfo() {
		return {
			currentPage: this.currentPage,
			pageSize: this.pageSize,
			hasNext: this.hasNextPage(),
			hasPrevious: this.currentPage() > 1
		};
	}

};
