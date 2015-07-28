import React from 'react';
import Editor from 'modeled-content/components/Editor';

export default React.createClass({
	displayName: 'EducationItem',

	propTypes: {
		item: React.PropTypes.object.isRequired,
		onChange: React.PropTypes.func
	},

	editorChange (fieldName, oldValue, newValue) {
		this.valueChanged(fieldName, newValue);
	},

	componentWillMount: function() {
		this.setState({
			item: this.props.item
		});
	},

	componentWillReceiveProps: function(nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState({
				item: nextProps.item
			});
		}
	},

	onChange (event) {
		let {target} = event;
		let {name, value} = target;
		this.valueChanged(name, value);
	},

	valueChanged (field, newValue) {
		let {item={}} = this.state;

		item = Object.assign({}, item, {[field]: newValue});

		this.setState({item});

		if (this.props.onChange) {
			this.props.onChange(item);
		}
	},

	render () {

		let {item} = this.props;

		return (
			<div className="educational-experience">
				<div>
					<label className="required">School</label>
					<input
						type="text"
						name="school"
						defaultValue={item.school}
						className="required"
						required
						onChange={this.onChange} />
				</div>
				<div className="degree">
					<div>
						<label>Degree</label>
						<input type="text" name="degree" defaultValue={item.degree} onChange={this.onChange} />
					</div>
					<div className="education-years">
						<div>
							<label>Start Year</label>
							<input type="number" name="startYear" defaultValue={item.startYear} onChange={this.onChange} />
						</div>
						<div>
							<label>End Year</label>
							<input type="number" name="endYear" defaultValue={item.endYear} onChange={this.onChange} />
						</div>
					</div>
				</div>
				<label>Description</label>
				<Editor className="description" value={item.description} onChange={this.editorChange.bind(this, 'description')} />
			</div>
		);
	}
});
