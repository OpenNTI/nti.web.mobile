

var React = require('react');
var RenderField = require('../mixins/RenderFormConfigMixin');

var FormPanel = React.createClass({

	mixins: [RenderField],

	getDefaultProps: function() {
		return {
			noValidate: true,
			styled: true,
			subhead: null,
			title: null
		};
	},

	render: function() {
		var cssClasses = [];
		var formClasses = '';
		var headingClasses = '';

		if (this.props.styled) {
			headingClasses = 'column';
			formClasses = 'medium-6 medium-centered columns';
			cssClasses = ['row'];
		}

		if(this.props.busy) {
			cssClasses.push('busy');
		}


		return (
			<div className={cssClasses.join(' ')}>
				<form className={formClasses} onSubmit={this.props.onSubmit} noValidate={this.props.noValidate}>
					<div className={headingClasses}>
						{this.props.title && (<h2>{this.props.title}</h2>)}
						{this.props.subhead && (<p>{this.props.subhead}</p>)}
					</div>
					{this.props.children}
				</form>
			</div>
		);
	}

});

module.exports = FormPanel;
