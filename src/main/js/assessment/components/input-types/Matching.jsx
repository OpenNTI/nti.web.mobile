/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

//var isEmpty = require('dataserverinterface/utils/isempty');

/**
 * This input type represents Matching
 */
module.exports = React.createClass({
	displayName: 'Matching',
	mixins: [Mixin],

	statics: {
		inputType: [
			'Matching'
		]
	},

	render: function() {
		var dragSources = this.props.item.labels || [];
		var dropTargets = this.props.item.values || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		return (
			<div className="matching">
				<div className="terms">
					{dragSources.map((x,i)=>
						this.renderDragSource(x, i)
					)}
				</div>

				<form className="box">
					{dropTargets.map((x,i)=>
						this.renderDropTarget(x, i, solution)
					)}
				</form>

			</div>
		);
	},


	renderDragSource: function (term, index) {
		return (
			<div className="drag source" key={term} data-match={index}>
				<div className="match" data-source={term}>
					<a href="#" className="reset" title="Reset"/>
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</div>
		);
	},


	renderDropTarget: function (target, index/*, solution*/) {

		return (
			<div className="drop target" key={target} data-target={index}>
				<input type="hidden"/>
				<div className="match blank dropzone" data-term></div>
				<div className="content" dangerouslySetInnerHTML={{__html: target}}/>
			</div>
		);
	},


	getValue: function () {
		return null;
	}
});
