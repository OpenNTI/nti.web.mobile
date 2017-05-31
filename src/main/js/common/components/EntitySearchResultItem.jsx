import PropTypes from 'prop-types';
import React from 'react';

import SelectableEntity from './SelectableEntity';

export default class extends React.Component {
    static displayName = 'EntitySearchResultItem';

    static propTypes = {
		entity: PropTypes.object.isRequired,
		selected: PropTypes.bool,
		onChange: PropTypes.func
	};

    onChange = () => {
		const {entity, onChange} = this.props;
		onChange && onChange(entity);
	};

    render() {

		const {entity, selected} = this.props;

		return (
			<SelectableEntity
				entity={entity}
				selected={selected}
				onChange={this.onChange}
			/>
		);
	}
}
