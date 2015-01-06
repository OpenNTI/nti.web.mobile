'use strict';

var React = require('react/addons');
var Mixin = require('./Mixin');

var toArray = require('dataserverinterface/utils/toarray');
var isTruthy = require('dataserverinterface/utils/identity');
var valueIfChecked = function(i){return i.checked && i.value; };

/**
 * This input type represents Muliple Choice (with multiple answers--aka Checkboxes)
 */
module.exports = React.createClass({
	displayName: 'MultipleChoiceMulipleAnswer',
	mixins: [Mixin],

	statics: {
		inputType: 'MultipleChoiceMultipleAnswer'
	},

	render: function() {
		var choices = this.props.item.choices || [];
		var submitted = this.isSubmitted();
		var solution = submitted && this.getSolution();

		return (
			<form className="multiple-choice multiple-answer" ref="form">
				{choices.map((x,i)=>{
					return this.renderChoice(x, i, solution);
				})}
			</form>
		);
	},


	renderChoice: function (choice, index, solution) {
		var numeral = String.fromCharCode(65+index);
		var ref = 'choice-' + index;
		var checked = (this.state.value || []).indexOf(index) !== -1;
		var correct = '';

		if (solution) {
			solution = (solution.value || []).indexOf(index) > -1;

			if (checked) {
				correct = solution ? 'correct' : 'incorrect';
			}
		}

		return (
			<label className={'choice ' + correct} key={ref}>
				<input type="checkbox" ref={ref} checked={checked} value={index} onChange={this.handleInteraction}/>
				<div>
					<span className="numeral">{numeral}.</span>
					<span className="choice-content" dangerouslySetInnerHTML={{__html: choice}}/>
				</div>
			</label>
		);
	},


	getValue: function () {
		var ref = this.refs.form;
		var form = ref && ref.getDOMNode();
		var inputs = form && toArray(form.elements);
		var values = form && inputs
							.map(valueIfChecked)
							.filter(isTruthy)
							.map(function(i){return parseInt(i,10);});

		return !form ? undefined :
					values.length ?
						values : null;
	}
});
