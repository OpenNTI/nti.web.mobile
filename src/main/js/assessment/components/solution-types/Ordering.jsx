import React from 'react';
import Mixin from './Mixin';

import Content from '../Content';

/**
 * This solution type represents Ordering
 */
export default React.createClass({
	displayName: 'Ordering',
	mixins: [Mixin],

	statics: {
		inputType: [
			'Ordering'
		]
	},


	propTypes: {
		item: React.PropTypes.object
	},


	render () {
		let values = this.props.item.labels || [];
		let solution = (this.state.solution || {}).value;
		let ex = this.state.explanation || '';

		solution = solution && Array.from(Object.assign({length: values.length}, solution));

		return (
			<div className="ordered solutions">
				<form className="box">
					<div className="ordering">
						{values.map((x, i)=>this.renderRow(x, i, solution) )}
					</div>
				</form>
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderRow (target, targetIndex, solution) {
		let sources = this.props.item.values || [];
		let source = sources[solution[targetIndex]];

		return (
			<div className="match-row" key={targetIndex}>
				<Content className="cell ordinal" content={target}/>
				<div className="cell value">
					<div className="order source">
						<Content content={source}/>
					</div>
				</div>
			</div>
		);
	}
});
