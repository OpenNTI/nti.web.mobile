'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var {getEventTarget} = require('common/Utils').Dom;

var toArray = require('dataserverinterface/utils/toarray');
var isTruthy = require('dataserverinterface/utils/identity');

var valueIfChecked = (i)=> i.checked && i.value;

/**
 * This input type represents Muliple Choice (with one answer--aka Radio Buttons)
 */
module.exports = React.createClass({
	displayName: 'MultipleChoice',
	mixins: [Mixin],

	statics: {
		inputType: [
			'MultipleChoice',
			'RandomizedMultipleChoice'
		]
	},

	render () {
		var item = this.props.item;
		var choices = item.choices || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		return (
			<form className="multiple-choice" ref="form">
				{choices.map((x,i)=>{
					return this.renderChoice(x, i, solution);
				})}
			</form>
		);
	},


	onClick (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		var label = getEventTarget(e, 'label');
		var input = label && label.querySelector('input');
		if (input) {
			input.checked = !input.checked;
		}

		console.log('Clicked');
		this.handleInteraction();
	},


	renderChoice (choice, index, solution) {
		var numeral = String.fromCharCode(65+index);
		var group = this.props.item.getID();
		var checked = this.state.value === index;
		var correct = '';

		if (solution) {
			solution = solution.value === index;

			if (checked) {
				correct = solution ? 'correct' : 'incorrect';
			}
		}

		return (
			<label className={'choice ' + correct} key={'choice-'+index} onClick={this.onClick}>
				<input type="radio" name={group} checked={checked} value={index} onChange={this.handleInteraction}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	},


	getValue () {
		var ref = this.refs.form;
		var form = ref && ref.getDOMNode();
		var inputs = form && toArray(form.elements);
		var values = form && inputs
							.map(valueIfChecked)
							.filter(isTruthy)
							.map(function(i){return parseInt(i,10);});

		return !form ? undefined :
					values.length===1 ?
						values[0] : null;
	}
});
