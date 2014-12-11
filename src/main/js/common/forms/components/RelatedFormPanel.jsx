/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FormPanel = require('./FormPanel');
var FormRenderMixin = require('../mixins/RenderFormConfigMixin');
var RelatedFormStore = require('../RelatedFormStore');

var RelatedFormPanel = React.createClass({

	mixins: [FormRenderMixin],

	propTypes: {
		formConfig: React.PropTypes.array.isRequired,
		translator: React.PropTypes.func,
		storeContextId: React.PropTypes.string.isRequired
	},

	getDefaultProps: function() {
		return {
			depth: 0
		};
	},

	getInitialState: function() {
		return {
			relatedForm: null,
			fieldValues: {},
			subfields: {}
		};
	},

	// componentWillReceiveProps: function(newProps) {
	// 	this._clearStoreValues();
	// 	// this.setState(this.getInitialState());
	// 	this._syncRelatedFormState(this.props.formConfig, RelatedFormStore.getValues(this.props.storeContextId));
	// },

	componentDidMount: function() {
		if(this.props.depth === 0) {
			RelatedFormStore.addChangeListener(this._storeChange);
		}
	},

	_clearStoreValues: function() {
		RelatedFormStore.clearValues(this.props.storeContextId, Object.keys(this.state.fieldValues||{}));
	},

	componentWillUnmount: function() {
		this._clearStoreValues();
		if(this.props.depth === 0) {
			RelatedFormStore.removeChangeListener(this._storeChange);
		}
	},

	_storeChange: function() {
		// console.debug(RelatedFormStore.getValues(this.props.storeContextId));
	},

	_inputChanged: function(event) {
		// stashing values in the store under a contextid for this
		// form and all its subforms provides an easy way to keep
		// track of the merged set of field values.
		var target = event.target;
		var name = target.name;
		var value = target.value;
		if (target.type === 'checkbox' && !target.checked) {
			RelatedFormStore.clearValues(this.props.storeContextId, [name]);
		}
		else {
			RelatedFormStore.setValue(this.props.storeContextId, name, value);	
		}
	},

	render: function() {
		var values = RelatedFormStore.getValues(this.props.storeContextId); // this.state.fieldValues
		var form = this.renderFormConfig(this.props.formConfig, values, this.props.translator);
		var relatedForm = null;
		if (this.state.relatedForm) {
			var newDepth = this.props.depth + 1;
			relatedForm = <RelatedFormPanel depth={newDepth}
							formConfig={this.state.relatedForm}
							translator={this.props.translator}
							storeContextId={this.props.storeContextId}
							ref='subform' />;
		}

		return (
			<div className="recursiveForm" data-depth={this.props.depth}>
				<FormPanel>
					{form}
				</FormPanel>
				{relatedForm}
			</div>
		);
	}

});

module.exports = RelatedFormPanel;
