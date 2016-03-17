import React from 'react';

import SelectableEntity from './SelectableEntity';

export default React.createClass({
	displayName: 'EntitySearchResultItem',

	propTypes: {
		entity: React.PropTypes.object.isRequired,
		selected: React.PropTypes.bool,
		onChange: React.PropTypes.func
	},

	onChange () {
		const {entity, onChange} = this.props;
		onChange && onChange(entity);
	},

	render () {

		const {entity, selected} = this.props;

		return (
			<SelectableEntity
				entity={entity}
				selected={selected}
				onChange={this.onChange}
			/>
		);
	}
});
