'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');

var Content = require('../Content');

var {Mixin, Draggable, DropTarget} = require('common/dnd');

/**
 * This input type represents Ordering
 */
module.exports = React.createClass({
	displayName: 'Ordering',
	mixins: [InputType, Mixin],

	statics: {
		inputType: [
			'Ordering'
		]
	},


	getInitialState () {
		return {
			PartLocalDNDToken: 'default'
		};
	},


	getDefaultValue () {
		var values = (this.props.item || {}).labels || [];
		return Object.assign({}, values.map((_,i)=>i));
	},


	componentWillMount () {
		this.setState({
			PartLocalDNDToken: this.getNewUniqueToken(),
			value: this.props.value || this.getDefaultValue()
		});
	},


	getLabel (index) {
		return this.props.item.labels[index];
	},


	_getValue (index) {
		return this.props.item.values[index];
	},


	onDrop (drop) {
		var value = Object.assign({}, this.getValue());
		var valueArray = this.getValueAsArray();
		var data = drop || {};
		var {source, target} = data;
		var swapFrom;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		if (target == null || source == null) {
			console.error('Missing target and/or source');
			throw new Error('Illegal State, there must be BOTH a source and a target');
		}

		swapFrom = valueArray.indexOf(source);
		if (swapFrom < 0) {
			console.error('Nothing to swap');
			throw new Error('Illegal State!');
		}

		console.debug(`Drop: %s (%s)
		onto %s (%s),
		swappingWith: %s (%s)`,

			this._getValue(source),
			source,
			target,
			this.getLabel(target),
			swapFrom,
			this.getLabel(swapFrom),
			value[swapFrom],
			this._getValue(value[swapFrom])
			);

		value[swapFrom] = value[target];

		value[target] = source;




		this.__setValue(value);
	},


	render () {
		var dropTargets = this.props.item.labels || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		return (
			<form className="ordering">
				{dropTargets.map((x,i)=>
					this.renderDropTarget(x, i, solution)
				)}
			</form>
		);
	},


	renderDropTarget (target, targetIndex, solution) {

		return (
			<DropTarget accepts={this.state.PartLocalDNDToken}
				className="match-row"
				key={targetIndex}
				data-target={targetIndex}>

				<Content className="cell ordinal" content={target}/>
				<div className="cell value">
					{this.renderDraggable(targetIndex, solution)}
				</div>

			</DropTarget>
		);
	},


	renderDraggable (targetIndex, solution) {
		var correct = '';
		var sources = this.props.item.values || [];
		var value = this.getValue();
		var sourceIndex = value[targetIndex];

		if (!value || sourceIndex < 0 || sourceIndex == null) {
			console.warn('THIS SHOULD NOT HAPPEN', value);
			return null;
		}

		if (solution && solution.value) {
			solution = solution.value;
			correct = solution[targetIndex] === sourceIndex ? 'correct' : 'incorrect';
		}

		return this.renderDragSource(sources[sourceIndex], sourceIndex, targetIndex, `dropped ${correct}`);
	},


	renderDragSource (source, sourceIndex, targetIndex, extraClass, lock) {
		var locked = this.isSubmitted() || Boolean(lock) || this.state.busy;
		var classes = ['order','source'];

		if (locked) {
			classes.push('locked');
		}

		if (extraClass) {
			classes.push(extraClass);
		}

		return (
			<Draggable
				axis="y"
				data-source={sourceIndex}
				constrain=""
				key={sourceIndex}
				locked={locked}
				type={this.state.PartLocalDNDToken}
				>
				<div className={classes.join(' ')} key={sourceIndex}>
					<Content content={source}/>
					<span className="hamburger small"><span/></span>
				</div>
			</Draggable>
		);
	},

	//The mixin implements @setValue(), but it just for external usage...when
	// we interact with this widget, and update the value state internally,
	// this will apply the state, and notify the store of the change.
	__setValue (value) {
		var {length} = this.props.item.values;
		var array = Array.from(Object.assign({length: length}, value));

		if (value && Object.keys(value).length !== length) {
			value = null;
		}

		var seen = {};
		function notSeen(x) {
			var s = seen[x]; seen[x] = 1;
			return !s;
		}

		if (array.filter(x=>x!=null && notSeen(x)).length !== length) {
			console.warn('Something went wrong. Preventing bad value from persisting. Here is the bad value:', value);
			return;
		}
		console.debug('Setting state: %o', value);
		this.setState({value: value}, this.handleInteraction);
	},


	getValue () {
		return this.state.value || this.getDefaultValue();
	},


	getValueAsArray () {
		var {length} = this.props.item.values;
		return Array.from(Object.assign({length: length}, this.getValue()));
	}
});
