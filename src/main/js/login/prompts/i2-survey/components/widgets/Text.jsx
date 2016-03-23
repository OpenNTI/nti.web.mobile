import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: '',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	onChange (e) {
		this.setState({ value: e.target.value });
	},

	render () {
		const {element} = this.props;
		return (
			<div className="text widget">
				<label>{element.label}</label>
				<input type="text" name={element.name} onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
});
