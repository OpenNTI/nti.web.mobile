'use strict';

// var Actions = require('../../Actions');
// var Constants = require('../../Constants');
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
			solution: null,
			explanation: null
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this.__onStoreChange);
		this.__onStoreChange();
	},



	componentWillUnmount: function() {
		Store.removeChangeListener(this.__onStoreChange);
	},


	componentWillReceiveProps: function(props) {
		this.__onStoreChange(props);
	},


	__onStoreChange: function (props) {
		var part = (props || {}).item || this.props.item;
		var solution = Store.getSolution(part);
		var explanation = Store.getExplanation(part);
		this.setState({
			solution: solution,
			explanation: explanation
		});
	}
};
