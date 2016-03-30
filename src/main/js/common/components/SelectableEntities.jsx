import React from 'react';
import SelectableEntity from './SelectableEntity';

import SelectionModel from '../utils/ListSelectionModel';

export default React.createClass({
	displayName: 'SelectableEntities',

	propTypes: {
		selection: React.PropTypes.instanceOf(SelectionModel).isRequired,

		entities: React.PropTypes.any,

		onChange: React.PropTypes.func,

		labels: React.PropTypes.object,

		linkToProfile: React.PropTypes.any
	},

	onChange (entity) {
		let {onChange = ()=> {}} = this.props;
		return Promise.resolve(onChange(entity));
	},

	render () {
		let {entities, labels, selection, linkToProfile} = this.props;

		return (
			<ul className="selectable-entities" {...this.props}>
				{Array.from(entities).map(entity =>
					<SelectableEntity
						linkToProfile={linkToProfile}
						key={entity.getID()}
						entity={entity}
						selected={selection.isSelected(entity)}
						labels={labels}
						onChange={this.onChange}
					/>
				)}
			</ul>
		);
	}
});
