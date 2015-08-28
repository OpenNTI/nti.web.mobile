import React from 'react';
import SelectableEntities from 'common/components/SelectableEntities';
import SelectionModel from 'common/utils/ListSelectionModel';
import SwipeEntity from './SwipeEntity';

export default React.createClass({
	displayName: 'Selectables',

	propTypes: {
		entities: React.PropTypes.array.isRequired,
		linkToProfile: React.PropTypes.any
	},

	componentWillMount () {
		this.setUpSelectionModel();
		this.rememberOriginalList();
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.entities !== this.props.entities) {
			this.setUpSelectionModel(nextProps);
		}
	},

	rememberOriginalList (props = this.props) {
		this.setState({
			original: (props.entities || []).slice()
		});
	},

	setUpSelectionModel (props = this.props) {
		let selection = new SelectionModel(props.entities);
		this.setState({
			selection
		});
	},

	render () {
		return (
			<div>
				<div className="swipers selectable-entities">
				{
					this.state.original.map(entity => {
						return <SwipeEntity {...this.props} selection={this.state.selection} entity={entity} />;
					})
				}
				</div>
				{/* <SelectableEntities {...this.props} selection={this.state.selection} entities={this.state.original} /> */}
			</div>
		);
	}
});
