/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');

var {Mixin, Draggable, DropTarget} = require('common/dnd');

//var isEmpty = require('dataserverinterface/utils/isempty');

/**
 * This input type represents Matching
 */
module.exports = React.createClass({
	displayName: 'Matching',
	mixins: [InputType, Mixin],

	statics: {
		inputType: [
			'Matching'
		]
	},


	getInitialState: function() {
		return {
			dndType: 'default'
		};
	},


	componentDidMount: function() {
		// This looks confusing, I know. This `type` object is passed as
		// a value to the DragTarget accepts prop. Its also set to the
		// type prop of the Draggable. When a Draggable is over a
		// DropTarget, the DropTarget compares the Draggable's type with
		// its accepts list, if it accepts it, the DropTarget will let the
		// Draggable drop onto it.
		//
		// The accepts function on this anonymouse object will test if the
		// argument passed to it is the exact same object as `type`.  Meaning,
		// our parts will only work with this instance.
		var type = { accepts: (t)=> t === type };


		this.setState({
			dndType: type
		});
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
			<Draggable type={this.state.dndType} className="drag source" key={term} data-match={index}>
				<div className="match" data-source={term}>
					<a href="#" className="reset" title="Reset"/>
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</Draggable>
		);
	},


	renderDropTarget: function (target, index/*, solution*/) {

		return (
			<div className="drop target" key={target} data-target={index}>
				<input type="hidden"/>
				<DropTarget accepts={this.state.dndType} className="match blank dropzone" data-term/>
				<div className="content" dangerouslySetInnerHTML={{__html: target}}/>
			</div>
		);
	},


	getValue: function () {
		return null;
	}
});
