'use strict';

var React = require('react/addons');
var InputType = require('./Mixin');

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
		var values = (this.props.item || {}).values || [];
		return values.map((_,i)=>i).map((_,i)=>i);
	},


	componentDidMount () {
		this.setState({
			PartLocalDNDToken: this.getNewUniqueToken(),
			value: this.props.value || this.getDefaultValue()
		});
	},


	render () {
		var dropTargets = this.props.item.values || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		return (
			<div className="ordering">

				<form className="box">
					{dropTargets.map((x,i)=>
						this.renderDropTarget(x, i, solution)
					)}
				</form>

			</div>
		);
	},


	renderDropTarget (target, index, solution) {

		return (
			<DropTarget accepts={this.state.PartLocalDNDToken} className="drop target" key={target} data-target={index}>
				<div className="content" dangerouslySetInnerHTML={{__html: target}}/>
				<div className="match dropzone" data-dnd>
					{this.renderDraggable(index, solution)}
				</div>
			</DropTarget>
		);
	},


	renderDraggable (dropTargetIndex, solution) {
		var sources = this.props.item.labels || [];
		var value = this.state.value;
		var correct = '';
		var sourceIndex = Object.keys(value || {})
							.reduce((x, v)=>x || (value[v]===dropTargetIndex ?
								parseInt(v, 10) : x), NaN);

		if (isNaN(sourceIndex)) {
			console.warn('THIS SHOULD NEVER HAPPEN!');
			return null;
		}

		if (solution && solution.value) {
			solution = solution.value;
			correct = solution[sourceIndex] === dropTargetIndex ? 'correct' : 'incorrect';
		}

		return this.renderDragSource(sources[sourceIndex], sourceIndex, `dropped ${correct}`);
	},


	renderDragSource (term, index, extraClass, lock) {
		var locked = this.isSubmitted() || Boolean(lock);
		var classes = ['drag','order','source'];

		if (locked) {
			classes.push('locked');
		}

		if (extraClass) {
			classes.push(extraClass);
		}

		return (
			<Draggable
				axis="y"
				data-source={index}
				key={term}
				locked={locked}
				type={this.state.PartLocalDNDToken}
				>
				<div className={classes.join(' ')} key={term} data-source={term} data-match={index}>
					<div dangerouslySetInnerHTML={{__html: term}}/>
				</div>
			</Draggable>
		);
	},


	getValue: function () {
		// var ref = this.refs.input;
		// var input = ref && ref.getDOMNode();
		// var value = input && input.value;
		//
		// return isEmpty(value) ? null : value;
	}
});
