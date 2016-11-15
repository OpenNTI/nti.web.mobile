import React from 'react';
import SelectableEntity from './SelectableEntity';

import {Selection} from 'nti-commons';

export default React.createClass({
	displayName: 'SelectableEntities',

	propTypes: {
		selection: React.PropTypes.instanceOf(Selection.EntitySelectionModel).isRequired,

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
		let {entities, labels, selection, linkToProfile, ...props} = this.props;

		return (
			<ul className="selectable-entities" {...props}>
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
