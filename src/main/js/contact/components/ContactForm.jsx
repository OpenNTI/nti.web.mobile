import React from 'react';
import FormPanel from 'common/forms/components/FormPanel';
import RenderField from 'common/forms/mixins/RenderFormConfigMixin';
import t from 'common/locale';
import BasePathAware from 'common/mixins/BasePath';
import {sendMessage} from '../Actions';

export default React.createClass({
	displayName: 'ContactForm',
	mixins: [BasePathAware, RenderField],

	propTypes: {
		onSubmit: React.PropTypes.func,
		fieldConfig: React.PropTypes.array.isRequired
	},


	getInitialState () {
		return {
			fieldValues: {}
		};
	},


	handleSubmit (event) {
		event.preventDefault();
		sendMessage(this.state.fieldValues);
	},


	render () {
		let fields = this.renderFormConfig(
				this.props.fieldConfig,
				this.state.fieldValues,
				t);

		return (
			<FormPanel onSubmit={this.handleSubmit}>
				{fields}
				<input type="submit"
					key="submit"
					id="contact:submit"
					className="small-12 columns tiny button radius"
					value="Send" />
			</FormPanel>
		);
	}

});
