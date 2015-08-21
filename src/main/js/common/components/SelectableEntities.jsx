import React from 'react';
import SelectableEntity from './SelectableEntity';

import SelectionModel from '../utils/ListSelectionModel';

export default React.createClass({
	displayName: 'SelectableEntities',

	propTypes: {
		selection: React.PropTypes.instanceOf(SelectionModel).isRequired,

		entities: React.PropTypes.any,

		onChange: React.PropTypes.func,

		labels: React.PropTypes.object
	},

	onChange (entity) {
		let {onChange = ()=> {}} = this.props;
		return Promise.resolve(onChange(entity));
	},

	render () {
		let {entities, labels, selection} = this.props;

		return (
			<ul className="selectable-entities" {...this.props}>
				{entities.map(entity =>
					<SelectableEntity
						key={entity.getID()}
						entity={entity}
						selected={selection.isSelected(entity)}
						labels={labels}
						onChange={this.onChange.bind(this, entity)}
					/>
				)}
			</ul>
		);
	}
});
