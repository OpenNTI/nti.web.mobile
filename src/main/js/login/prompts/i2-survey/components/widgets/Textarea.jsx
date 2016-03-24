import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Textarea',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="textarea widget">
				<label>{element.label}</label>
				<textarea name={element.name}></textarea>
			</div>
		);
	}
});
