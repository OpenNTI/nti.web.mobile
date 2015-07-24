import React from 'react';
import EducationItem from './EducationItem';

export default React.createClass({
	displayName: 'Education:Edit',

	propTypes: {
		items: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			items: []
		};
	},

	componentWillMount: function() {
		this.setState({
			items: this.props.items
		});
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			items: nextProps.items
		});
	},


	itemChanged(item, newValue) {
		if (this.props.onChange) {
			this.props.onChange(this.props.items);
		}
	},

	addEntry () {
		this.state.items.push({
			MimeType: 'application/vnd.nextthought.profile.educationalexperience'
		});
		this.forceUpdate();
	},

	removeEntry (index) {
		this.state.items.splice(index, 1);
		this.forceUpdate();
	},

	render () {
		let {items} = this.state;
		return (
			<div>
				{(items || []).map((item, index) => {
					return (
						<div>
							<div className="remove" onClick={this.removeEntry.bind(this, index)}>X</div>
							<EducationItem item={item} key={`ed-item-${index}`} onChange={this.itemChanged.bind(this, item)} />
						</div>
					);
				})}
				<div className="controls buttons">
					<button onClick={this.addEntry}>Add Entry</button>
				</div>
			</div>

		);
	}
});
