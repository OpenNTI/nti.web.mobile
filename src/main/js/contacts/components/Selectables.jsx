import React from 'react';
import SelectableEntities from 'common/components/SelectableEntities';
import SelectionModel from 'common/utils/ListSelectionModel';

export default React.createClass({
	displayName: 'Selectables',

	propTypes: {
		entities: React.PropTypes.array.isRequired
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
			<SelectableEntities {...this.props} selection={this.state.selection} entities={this.state.original} />
		);
	}
});
