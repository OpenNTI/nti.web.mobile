import React from 'react/addons';
import FormPanel from 'common/forms/components/FormPanel';
import RenderField from 'common/forms/mixins/RenderFormConfigMixin';
import {translate as t} from 'common/locale';
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


	_handleSubmit (event) {
		event.preventDefault();
		sendMessage(this.state.fieldValues);
	},


	render () {
		var fields = this.renderFormConfig(
				this.props.fieldConfig,
				this.state.fieldValues,
				t);

		return (
			<FormPanel onSubmit={this._handleSubmit}>
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
