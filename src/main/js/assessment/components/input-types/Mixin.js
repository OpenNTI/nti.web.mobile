'use strict';

var Actions = require('../../Actions');
var Constants = require('../../Constants');
var Store = require('../../Store');

module.exports = {

	statics: {
		handles: function(item) {
			if (!this.__inputTypeCleaned) {
				//ensure data type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach(function(s,i,a){a[i]=s.toLowerCase();});

				//prevent re-entry:
				this.__inputTypeCleaned = true;
			}

			//Perform actual test...
			return this.__test(item);

		},


		__test: function (item) {
			var type = item.MimeType
				.replace('application/vnd.nextthought.assessment.', '')
				.replace(/part$/i, '')
				.toLowerCase();
			return (this.inputType.indexOf(type) !== -1);
		}
	},


	getInitialState: function() {
		return {
			interacted: false
		};
	},



	componentDidMount: function() {
		Store.addChangeListener(this.__onStoreChange);
	},



	componentWillUnmount: function() {
		Store.removeChangeListener(this.__onStoreChange);
	},


	__onStoreChange: function (eventData) {
		var props = this.props;
		if (eventData === Constants.SYNC) {
			this.setValue(Store.getPartValue(props.item));
		}
	},


	isSubmitted: function () {
		return Store.isSubmitted(this.props.item);
	},


	getSolution: function () {
		return Store.getSolution(this.props.item);
	},


	getAssessedPart: function () {
		var item = this.props.item;
		var question = Store.getAssessedQuestion(item, item.getQuestionId());

		//If we have an AssessedQuestion, it has a property "parts" that is an array
		var parts = (question && question.parts) || [];

		//Get the question part or return undefined.
		return parts[item.getPartIndex()];
	},


	setValue: function (value) {
		this.setState({value: value});
	},


	hasInteracted: function () {
		return this.state.interacted;
	},


	handleInteraction: function() {
		var locked = this.isSubmitted();
		var p = this.props;
		var v = locked ? this.state.value : this.getValue();

		this.setState({ interacted: true, value: v });
		if (!locked) {
			Actions.partInteracted(p.item, v);
		}
	}
};
