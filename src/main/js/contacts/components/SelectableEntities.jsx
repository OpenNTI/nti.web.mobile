import React from 'react';
import SelectableEntity from './SelectableEntity';
import listContainsEntity from '../list-contains-entity';

const labels = {
	selected: 'Remove',
	unselected: 'Undo'
};

export default React.createClass({
	displayName: 'SelectableEntities',

	propTypes: {
		entities: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	},

	getInitialState () {
		return {
			originalList: []
		};
	},

	componentWillMount () {
		this.rememberList();
	},

	rememberList (props=this.props) {
		let {entities} = props;
		this.setState({
			originalList: (entities || []).slice()
		});
	},

	onChange (entity) {
		return Promise.resolve(this.props.onChange(entity));
	},

	render () {


		let {entities} = this.props;
		let {originalList} = this.state;

		return (
			<ul className="selectable-entities" {...this.props}>
				{originalList.map(entity =>
					<SelectableEntity
						key={entity.getID()}
						entity={entity}
						selected={listContainsEntity(entities, entity)}
						labels={labels}
						onChange={this.onChange.bind(this, entity)}
					/>
				)}
			</ul>
		);
	}
});
