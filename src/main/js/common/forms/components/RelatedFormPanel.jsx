/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FormPanel = require('./FormPanel');
var FormRenderMixin = require('../mixins/RenderFormConfigMixin');

var RelatedFormPanel = React.createClass({

	mixins: [FormRenderMixin],

	propTypes: {
		formConfig: React.PropTypes.array.isRequired,
		translator: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			depth: 0
		};
	},

	getInitialState: function() {
		return {
			relatedForm: null,
			fieldValues: {}
		};
	},

	componentWillReceiveProps: function() {
		this.setState(this.getInitialState());
	},

	_inputChanged: function() {
		// merge values with state.fieldvalues
		// if we're not the root form, push it up to the parent.
	},

	render: function() {

		var form = this.renderFormConfig(this.props.formConfig, this.state.fieldValues, this.props.translator);
		var relatedForm = null;
		if (this.state.relatedForm) {
			var newDepth = this.props.depth + 1;
			relatedForm = <RelatedFormPanel depth={newDepth} formConfig={this.state.relatedForm} translator={this.props.translator} />;
		}

		return (
			<div className="recursiveForm">
				<FormPanel>
					{form}
				</FormPanel>
				{relatedForm}
			</div>
		);
	}

});

module.exports = RelatedFormPanel;
