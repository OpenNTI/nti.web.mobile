'use strict';

var React = require('react');
var InputType = require('./Mixin');

var Content = require('../Content');

var getEventTarget = require('nti.lib.dom/lib/geteventtarget');
var {Mixin, Draggable, DropTarget} = require('common/dnd');

//var isEmpty = require('nti.lib.interfaces/utils/isempty');

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

		Object.keys(value).forEach(x=>{
			if (value[x] === target) {
				delete value[x];
			}
		});

		value[source] = target;
		this.__setValue(value);
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

		var source = get('.source', 'data-source');
		//var target = get('.target', 'data-target');

		var val = Object.assign({}, this.state.value || {});

		delete val[source];
		this.__setValue(val);
	},


	__setValue (value) {
		if (value && Object.keys(value).length === 0) {
			value = null;
		}

		this.setState({value: value}, this.handleInteraction);
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


	renderDropTarget: function (target, targetIndex, solution) {

		return (
			<DropTarget accepts={this.state.PartLocalDNDToken} className="drop target" key={targetIndex} data-target={targetIndex}>
				<input type="hidden"/>
				<div className="match blank dropzone" data-dnd>
					{this.renderDroppedDragSource(targetIndex, solution)}
				</div>
				<Content className="content" content={target}/>
			</DropTarget>
		);
	},


	renderDroppedDragSource: function (targetIndex, solution) {
		var sources = this.props.item.labels || [];
		var value = Array.from(Object.assign({length: sources.length}, this.state.value || {}));
		var correct = '';
		var dragSourceIndex = value.indexOf(targetIndex);

		if (dragSourceIndex < 0) {
			return null;
		}

		if (solution && solution.value) {
			solution = solution.value;

			correct = solution[dragSourceIndex] === targetIndex ? 'correct' : 'incorrect';
		}

		return this.renderDragSource(sources[dragSourceIndex], dragSourceIndex, 'dropped '+correct);
	},


	renderDragSource: function (term, sourceIndex, extraClass, lock) {
		var locked = this.isSubmitted() || Boolean(lock);
		var classes = ['drag','match','source'];
		if (locked) {
			classes.push('locked');
		}

		if (extraClass) {
			classes.push(extraClass);
		}

		return (
			<Draggable
				cancel=".reset"
				data-source={sourceIndex}
				key={sourceIndex}
				locked={locked}
				type={this.state.PartLocalDNDToken}
				>
				<div className={classes.join(' ')} key={sourceIndex} data-source={sourceIndex}>
					{!locked && (
						<a href="#" className="reset" title="Reset" onClick={this.onDragReset}/>
					)}
					<Content content={term}/>
				</div>
			</Draggable>
		);
	},


	getValue: function () {
		return this.state.value;
	}
});
