'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var toArray = require('dataserverinterface/utils/toarray');

/**
 * This solution type represents Matching
 */
module.exports = React.createClass({
	displayName: 'MatchingAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'Matching'
		]
	},

	render: function() {
		var values = this.props.item.values || [];
		var solution = (this.state.solution || {}).value;
		var ex = this.state.explanation || '';

		solution = solution && toArray(Object.assign({length: values.length}, solution));

		return (
			<div className="matching solutions">
				<div className="matching">
					<form className="box">
					{values.map((x,i)=>
						this.renderDropTarget(x, i, solution) )}
					</form>
				</div>
				<div className="explanation" dangerouslySetInnerHTML={{__html: ex}}/>
			</div>
		);
	},


	renderDragSource: function (term, index) {
		return (
			<div className="drag source" data-match={index} key={term + index}>
				<div className="match" data-source={term}>
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</div>
		);
	},


	renderDropTarget: function (value, idx, solution) {
		var i = solution && solution.indexOf(idx);
		var labels = this.props.item.labels || [];
		var label = labels[i];

		if (!solution) {
			return null;
		}

		return (
			<div className="drop target" key={idx} data-target={idx}>
				<div className="match blank dropzone" data-term>
					{this.renderDragSource(label, i)}
				</div>
				<div className="content" dangerouslySetInnerHTML={{__html: value}}/>
			</div>
		);
	}
});
