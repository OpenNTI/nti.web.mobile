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


	onDrop: function (drop) {
		var value = Object.assign({}, this.state.value || {});
		var data = drop || {};
		var {source, target} = data;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		value[source] = target;
		this.setState({value: value});

//		this.handleInteraction();
	},


	render: function() {
		var dragSources = this.props.item.labels || [];
		var dropTargets = this.props.item.values || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		var isUsed = i => (this.state.value || {}).hasOwnProperty(i);

		return (
			<div className="matching">
				<div className="terms">
					{dragSources.map((x,i)=>
						this.renderDragSource(x, i, isUsed(i)?'used':'', isUsed(i))
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


	renderDragSource: function (term, index, extraClass, lock) {
		return (
			<Draggable type={this.state.dndType} key={term} data-source={index} locked={Boolean(lock)}>
				<div className={'drag match source '+(extraClass || '')}
					key={term} data-source={term} data-match={index}>
					<a href="#" className="reset" title="Reset"/>
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</Draggable>
		);
	},


	renderDropTarget: function (target, index/*, solution*/) {
		return (
			<DropTarget accepts={this.state.dndType} className="drop target" key={target} data-target={index}>
				<input type="hidden"/>
				<div className="match blank dropzone" data-target={index} data-term>
					{this.renderDroppedDragSource(index)}
				</div>
				<div className="content" dangerouslySetInnerHTML={{__html: target}}/>
			</DropTarget>
		);
	},


	renderDroppedDragSource: function (dropTargetIndex) {
		var terms = this.props.item.labels || [];
		var value = this.state.value;
		var dragSourceIndex = Object.keys(value || {})
			.reduce((x, v)=>x || (value[v]===dropTargetIndex ? parseInt(v, 10) : x), NaN);

		if (isNaN(dragSourceIndex)) {
			return null;
		}

		return this.renderDragSource(terms[dragSourceIndex], dragSourceIndex, 'dropped');
	},


	getValue: function () {
		return this.state.value || {};
	}
});
