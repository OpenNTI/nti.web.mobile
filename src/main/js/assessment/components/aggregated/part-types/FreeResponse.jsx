import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import CommonParts from './CommonParts';

export default createReactClass({
	displayName: 'AggregatedFreeResponse',
	mixins: [CommonParts],

	statics: {
		partType: [
			'FreeResponse'
		]
	},

	propTypes: {
		item: PropTypes.object
	},


	componentDidMount () { this.setup(); },
	componentDidUpdate (props) {
		if (this.props.item !== props.item) {
			this.setup();
		}
	},

	setup (props = this.props) {
		const {item: {Results}} = props;
		this.setState({
			index: 0,
			items: Object.keys(Results)
		});
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
		const {state: {items, index = 0}} = this;
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
		const {state: {items, index = 0}} = this;

		const page = index + 1;
		const total = items.length;

		const prev = cx('prev', {'disabled': total < 2});
		const next = cx('next', {'disabled': total < 2});

		return (
			<div className="aggregated-free-response">
				<div className="toolbar">
					<a href="#" onClick={this.previous} className={prev}>&nbsp;</a>
					<span className="page-info">{page} of {total}</span>
					<a href="#" onClick={this.next} className={next}>&nbsp;</a>
				</div>
				<div className="response">{items[index]}</div>
			</div>
		);
	}
});
