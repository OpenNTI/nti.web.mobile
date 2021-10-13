import './ActivityBucket.scss';
import createReactClass from 'create-react-class';

import Logger from '@nti/util-logger';
import { DateTime } from '@nti/web-commons';
import ItemsMixin from 'internal/activity/RenderItemsMixin';

import selectWidgetOverride from './activity-widget-overrides';

const logger = Logger.get('course:components:ActivityBucket');

const startDateFormat = DateTime.MONTH_NAME_DAY;
const MIN_COL_WIDTH = 260;
const MAX_WIDTH = 1024;

const WEIGHT = Symbol('weight');

const weights = {
	'application/vnd.nextthought.communityheadlinetopic': 3,
	'application/vnd.nextthought.forums.generalforumcomment': 0,
	'application/vnd.nextthought.courses.courseoutlinecontentnode': 1,
	'application/vnd.nextthought.courses.courseoutlinecalendarnode': 1,
	'application/vnd.nextthought.assessment.assignment': 1,
	'application/vnd.nextthought.note': 3,
};

class ActivityColumn {
	constructor() {
		this.items = [];
		this[WEIGHT] = 0;
	}

	add(item) {
		this.items.push(item);
		return (this[WEIGHT] += this.weightFor(item));
	}

	get weight() {
		return this[WEIGHT];
	}

	weightFor(item) {
		let w = weights[item.MimeType];
		if (w == null) {
			logger.warn(`No weight for MimeType: ${item.MimeType}`);
			w = 1;
		}
		return w;
	}

	[Symbol.iterator]() {
		let snapshot = this.items || [];
		let { length } = snapshot;
		let index = 0;
		return {
			next() {
				let done = index >= length;
				let value = snapshot[index++];

				return { value, done };
			},
		};
	}

	map(fn) {
		return Array.from(this).map(fn);
	}
}

class ActivityColumns {
	constructor(numCols) {
		this.cols = [];

		for (let i = 0; i < numCols; i++) {
			this.cols.push(new ActivityColumn());
		}
	}

	get shortestColumn() {
		let shortest = this.cols[0];
		for (let col of this.cols) {
			if (col.weight < shortest.weight) {
				shortest = col;
			}
		}
		return shortest;
	}

	add(item) {
		this.shortestColumn.add(item);
	}

	map(fn) {
		return Array.from(this.cols).map(fn);
	}
}

export default createReactClass({
	displayName: 'Course:ActivityBucket',
	mixins: [ItemsMixin],
	propTypes: {
		bucket: function (props, propName) {
			const p = props[propName];
			const isEndDate = p.end instanceof Date;
			const isStartDate = p.start instanceof Date;
			const isIterable = typeof p[Symbol.iterator] === 'function';
			if (!isEndDate || !isStartDate || !isIterable) {
				throw new Error('Not a Bucket');
			}
		},
	},

	getInitialState() {
		return {
			columns: [],
		};
	},

	componentDidMount() {
		window.addEventListener('resize', this.onResize);
		this.maybeSetColumnItems();
	},

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);
	},

	onResize() {
		this.maybeSetColumnItems();
	},

	binItems(numCols) {
		let cols = new ActivityColumns(numCols);
		for (let item of this.props.bucket) {
			cols.add(item);
		}
		return cols;
	},

	maybeSetColumnItems() {
		let { columns } = this.state;
		const width = Math.min(document.documentElement.clientWidth, MAX_WIDTH);
		const numCols = Math.max(1, Math.floor(width / MIN_COL_WIDTH));
		if (columns.length !== numCols) {
			this.setState({
				columns: this.binItems(numCols),
			});
		}
	},

	selectWidget(item, index, props) {
		return selectWidgetOverride(item, index, props);
	},

	render() {
		let { bucket } = this.props;
		let { columns } = this.state;
		let endDateFormat =
			bucket.start.getMonth() === bucket.end.getMonth()
				? DateTime.DAY_OF_THE_MONTH
				: startDateFormat;
		return (
			<li className="activity-bucket activity-item">
				<div className="header">
					<DateTime date={bucket.start} format={startDateFormat} /> -{' '}
					<DateTime date={bucket.end} format={endDateFormat} />
				</div>
				<div className="activity-columns">
					{columns.map((col, index) => (
						<div key={`col-${index}`} className="col">
							{col.map((items, idx) => (
								<div
									key={`item-${idx}`}
									className="bucketed-items"
								>
									{this.renderItems(items)}
								</div>
							))}
						</div>
					))}
				</div>
			</li>
		);
	},
});
