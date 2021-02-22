import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { rawContent } from '@nti/lib-commons';

import Content from '../Content';

import Mixin from './Mixin';

/**
 * This solution type represents Ordering
 */
export default createReactClass({
	displayName: 'Ordering',
	mixins: [Mixin],

	statics: {
		inputType: ['Ordering'],
	},

	propTypes: {
		item: PropTypes.object,
	},

	render() {
		let values = this.props.item.labels || [];
		let solution = (this.state.solution || {}).value;
		let ex = this.state.explanation || '';

		solution =
			solution && Array.from({ length: values.length, ...solution });

		return (
			<div className="ordered solutions">
				<form className="box">
					<div className="ordering">
						{values.map((x, i) => this.renderRow(x, i, solution))}
					</div>
				</form>
				<div className="explanation" {...rawContent(ex)} />
			</div>
		);
	},

	renderRow(target, targetIndex, solution) {
		let sources = this.props.item.values || [];
		let source = sources[solution[targetIndex]];

		return (
			<div className="match-row" key={targetIndex}>
				<Content className="cell ordinal" content={target} />
				<div className="cell value">
					<div className="order source">
						<Content content={source} />
					</div>
				</div>
			</div>
		);
	},
});
