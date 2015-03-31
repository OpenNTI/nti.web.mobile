import QueryString from 'query-string';

const pageSize = 2;

module.exports = {
	currentPage() {
		let loc = global.location || {};
		return parseInt(QueryString.parse(loc.search).p||1);
	},

	pageSize() {
		return pageSize;
	},

	batchStart() {
		return this.pageSize() * (this.currentPage() - 1);
	}

};

