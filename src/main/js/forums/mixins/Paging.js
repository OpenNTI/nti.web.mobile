import QueryString from 'query-string';
import {discussionsConfig} from 'common/utils';

let pageSize;

export default {
	currentPage () {
		let loc = global.location || {};
		let cp = parseInt(QueryString.parse(loc.search).p || 1, 10);
		return cp;
	},

	getPageSize () {
		if (pageSize == null) {
			pageSize = discussionsConfig().pageSize || 20;
		}
		return pageSize;
	},

	batchStart () {
		return this.getPageSize() * (this.currentPage() - 1);
	},

	numPages () {
		return Math.ceil((((this.state || {}).itemContents || {}).FilteredTotalItemCount || 0) / this.getPageSize());
	},

	hasNextPage () {
		return this.numPages() > (this.currentPage());
	},

	pagingInfo () {
		return {
			currentPage: this.currentPage,
			pageSize: this.getPageSize(),
			numPages: this.numPages(),
			hasNext: this.hasNextPage(),
			hasPrevious: this.currentPage() > 1
		};
	}

};
