import React from 'react';

import ItemsMixin from 'activity/RenderItemsMixin';

import DateTime from 'common/components/DateTime';

import Card from 'profile/components/Card';


const startDateFormat = 'MMMM D';
const MIN_COL_WIDTH = 250;
const MAX_WIDTH = 1024;

const WEIGHT = Symbol('weight');

const weights = {
	'application/vnd.nextthought.communityheadlinetopic': 3,
	'application/vnd.nextthought.forums.generalforumcomment': 2,
	'application/vnd.nextthought.courses.courseoutlinecontentnode': 1,
	'application/vnd.nextthought.assessment.assignment': 2
};

class ActivityColumn {

	constructor () {
		this.items = [];
		this[WEIGHT] = 0;
	}

	add (item) {
		this.items.push(item);
		return this[WEIGHT] += this.weightFor(item);
	}

	get weight () {
		return this[WEIGHT];
	}

	weightFor (item) {
		return weights[item.MimeType] || 1;
	}

	[Symbol.iterator] () {
		let snapshot = this.items || [];
		let {length} = snapshot;
		let index = 0;
		return {
			next () {
				let done = index >= length;
				let value = snapshot[index++];

				return { value, done };
			}
		};
	}

	map (fn) {
		return Array.from(this).map(fn);
	}
}

class ActivityColumns {
	constructor (numCols) {
		this.cols = [];

		for(let i = 0; i < numCols; i++) {
			this.cols.push(new ActivityColumn());
		}
	}

	get shortestColumn () {
		let shortest = this.cols[0];
		for(let col of this.cols) {
			if(col.weight < shortest.weight) {
				shortest = col;
			}
		}
		return shortest;
	}

	add (item) {
		this.shortestColumn.add(item);
	}

	map (fn) {
		return Array.from(this.cols).map(fn);
	}
}

export default React.createClass({
	displayName: 'Course:ActivityBucket',
	mixins: [ItemsMixin],
	propTypes: {
		bucket: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			columns: []
		};
	},

	componentDidMount () {
		window.addEventListener('resize', this.onResize);
		this.maybeSetColumnItems();
	},

	componentWillUnmount () {
		window.removeEventListener('resize', this.onResize);
	},

	onResize () {
		this.maybeSetColumnItems();
	},

	binItems (numCols) {
		let cols = new ActivityColumns(numCols);
		for (let item of this.props.bucket) {
			cols.add(item);
		}
		return cols;
	},

	maybeSetColumnItems () {
		let {columns} = this.state;
		const width = Math.min(document.documentElement.clientWidth, MAX_WIDTH);
		const numCols = Math.max(1, Math.floor(width / MIN_COL_WIDTH));
		if(columns.length !== numCols) {
			this.setState({
				columns: this.binItems(numCols)
			});
		}
	},

	render () {

		let {bucket} = this.props;
		let {columns} = this.state;
		let endDateFormat = bucket.start.getMonth() === bucket.end.getMonth() ? 'D' : startDateFormat;
		return (
			<Card>
				<div className="header"><DateTime date={bucket.start} format={startDateFormat} /> - <DateTime date={bucket.end} format={endDateFormat} /></div>
				{columns.map(col => (
					<div className="col">
						{col.map(items => <div className="bucketed-items">{this.renderItems(items)}</div>)}
					</div>
				) )}
				{/*<div className="bucketed-items">{this.renderItems(bucket, {className: 'bucketed-item'})}</div>*/}
			</Card>
		);
	}
});
