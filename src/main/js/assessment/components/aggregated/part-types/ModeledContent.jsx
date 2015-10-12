import React from 'react';
import cx from 'classnames';

import {Panel} from 'modeled-content';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedModeledContent',
	mixins: [CommonParts],

	statics: {
		partType: [
			'ModeledContent'
		]
	},

	propTypes: {
		item: React.PropTypes.object
	},


	previous (e) {
		e.preventDefault();
		e.stopPropagation();
		this.go(-1);
	},


	next (e) {
		e.preventDefault();
		e.stopPropagation();
		this.go(1);
	},


	go (direction) {
		const {props: {item: {Results: items}}, state: {index = 0}} = this;
		const total = items.length;

		let newIndex = direction + index;
		if (newIndex < 0) {
			newIndex = total - 1;
		} else if (newIndex >= total) {
			newIndex = 0;
		}

		this.setState({index: newIndex});
	},


	render () {
		const {props: {item: {Results: items}}, state: {index = 0}} = this;

		const page = index + 1;
		const total = items.length;

		const prev = cx('prev', {'disabled': total < 2});
		const next = cx('next', {'disabled': total < 2});

		return (
			<div className="aggregated-modeled-content">
				<div className="toolbar">
					<a href="#" onClick={this.previous} className={prev}>&nbsp;</a>
					<span className="page-info">{page} of {total}</span>
					<a href="#" onClick={this.next} className={next}>&nbsp;</a>
				</div>
				<Panel body={items[index]}/>
			</div>
		);
	}
});
