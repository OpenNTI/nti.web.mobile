import './SelectableEntities.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from '@nti/lib-commons';

import SelectableEntity from './SelectableEntity';

export default class extends React.Component {
	static displayName = 'SelectableEntities';

	static propTypes = {
		selection: PropTypes.instanceOf(Selection.EntitySelectionModel).isRequired,

		entities: PropTypes.any,

		onChange: PropTypes.func,

		labels: PropTypes.object,

		linkToProfile: PropTypes.any
	};

	onChange = (entity) => {
		let {onChange = ()=> {}} = this.props;
		return Promise.resolve(onChange(entity));
	};

	render () {
		let {entities, labels, selection, linkToProfile, ...props} = this.props;

		return (
			<ul className="selectable-entities" {...props}>
				{Array.from(entities).map(entity => (
					<SelectableEntity
						linkToProfile={linkToProfile}
						key={entity.getID()}
						entity={entity}
						selected={selection.isSelected(entity)}
						labels={labels}
						onChange={this.onChange}
					/>
				))}
			</ul>
		);
	}
}
