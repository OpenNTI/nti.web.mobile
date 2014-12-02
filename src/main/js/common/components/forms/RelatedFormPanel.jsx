/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FormPanel = require('./FormPanel');
var FormRenderMixin = require('./mixins/RenderFieldConfigMixin');

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

	render: function() {

		var form = this.renderFormConfig(this.props.formConfig, this.state.fieldValues, this.props.translator);
		var relatedForm = null;
		if (this.state.relatedForm) {
			relatedForm = this.transferPropsTo(<RelatedFormPanel depth={this.props.depth + 1} formConfig={this.state.relatedForm} />);
		}

		return this.transferPropsTo(
			<div>
				<FormPanel>
					{form}
				</FormPanel>
				{relatedForm}
			</div>
		);
	}

});

module.exports = RelatedFormPanel;
