'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');
var {getEventTarget} = require('common/Utils').Dom;
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
			PartLocalDNDToken: 'default'
		};
	},


	componentDidMount: function() {
		this.setState({
			PartLocalDNDToken: this.getNewUniqueToken()
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

		// The ONLY time that the '==' (double equals) operator is acceptable... testing for null
		// (which will evaluate to true for `null` and `undefined` but false for everything else)
		if (target == null || source == null) {
			throw new Error('Illegal State, there must be BOTH a source and a target');
		}

		value[source] = target;
		this.setState({value: value});

		this.handleInteraction();
	},


	onDragReset: function (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		function get(sel, attr) {
			var o = getEventTarget(e, sel+'['+attr+']');
			o = o && o.getAttribute(attr);
			//the double equals is intentional here.
			return o == null ? null : parseInt(o, 10);
		}

		var source = get('.source', 'data-match');
		//var target = get('.target', 'data-target');

		var val = Object.assign({}, this.state.value);

		delete val[source];
		this.setState({
			value: val
		});

		this.handleInteraction();
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
		var locked = this.isSubmitted() || Boolean(lock);
		return (
			<Draggable
				cancel=".reset"
				data-source={index}
				key={term}
				locked={locked}
				type={this.state.PartLocalDNDToken}
				>
				<div className={'drag match source '+(extraClass || '')}
					key={term} data-source={term} data-match={index}>
					{!locked && (
						<a href="#" className="reset" title="Reset" onClick={this.onDragReset}/>
					)}
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</Draggable>
		);
	},


	renderDropTarget: function (target, index/*, solution*/) {
		return (
			<DropTarget accepts={this.state.PartLocalDNDToken} className="drop target" key={target} data-target={index}>
				<input type="hidden"/>
				<div className="match blank dropzone" data-term>
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
