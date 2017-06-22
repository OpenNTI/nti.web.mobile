import React from 'react';
import PropTypes from 'prop-types';
import {Selection} from 'nti-commons';

import SwipeEntity from './SwipeEntity';

export default class extends React.Component {
	static displayName = 'Selectables';

	static propTypes = {
		entities: PropTypes.array.isRequired,
		linkToProfile: PropTypes.any
	};

	componentWillMount () {
		this.setUpSelectionModel();
		this.rememberOriginalList();
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.entities !== this.props.entities) {
			this.setUpSelectionModel(nextProps);
		}
	}

	rememberOriginalList = (props = this.props) => {
		this.setState({
			original: (props.entities || []).slice()
		});
	};

	setUpSelectionModel = (props = this.props) => {
		let selection = new Selection.EntitySelectionModel(props.entities);
		this.setState({
			selection
		});
	};

	render () {
		return (
			<div>
				<div className="swipers selectable-entities">
				{
					this.state.original.map(entity => {
						return <SwipeEntity key={entity.getID()} {...this.props} selection={this.state.selection} entity={entity} />;
					})
				}
				</div>
				{/* <SelectableEntities {...this.props} selection={this.state.selection} entities={this.state.original} /> */}
			</div>
		);
	}
}
