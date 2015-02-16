'use strict';

var React = require('react');
var Mixin = require('./Mixin');

var Content = require('../Content');

var toArray = require('dataserverinterface/utils/toarray');

/**
 * This solution type represents Ordering
 */
module.exports = React.createClass({
	displayName: 'Ordering',
	mixins: [Mixin],

	statics: {
		inputType: [
			'Ordering'
		]
	},


	render () {
		var values = this.props.item.labels || [];
		var solution = (this.state.solution || {}).value;
		var ex = this.state.explanation || '';

		solution = solution && toArray(Object.assign({length: values.length}, solution));

		return (
			<div className="ordered solutions">
				<form className="box">
					<div className="ordering">
						{values.map((x,i)=>this.renderRow(x, i, solution) )}
					</div>
				</form>
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderRow (target, targetIndex, solution) {
		var sources = this.props.item.values || [];
		var source = sources[solution[targetIndex]];

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
