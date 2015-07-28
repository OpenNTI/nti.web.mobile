import React from 'react';
import Editor from 'modeled-content/components/Editor';

export default React.createClass({
	displayName: 'EducationItem',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentWillMount () { this.setup(); },

	ccomponentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setup(nextProps);
		}
	},

	setup (props = this.props) {
		let {item} = props;
		let state = {};

		for(let field of ['school', 'degree', 'startYear', 'endYear', 'description']) {
			state[field] = item && item[field];
		}

		this.setState(state);
	},


	editorChange (_, newValue) {
		this.valueChanged('description', newValue);
	},

	onChange (event) {
		let {target} = event;
		let {name, value} = target;
		this.valueChanged(name, value);
	},

	valueChanged (field, newValue) {
		this.setState({[field]: newValue});
	},

	render () {

		let {school, degree, startYear, endYear, description} = this.state;

		return (
			<fieldset ref="form" className="educational-experience">
				<div>
					<label className="required">School</label>
					<input type="text" name="school" className="required" required
						value={school} onChange={this.onChange} />
				</div>

				<div className="degree">
					<div>
						<label>Degree</label>
						<input type="text" name="degree" value={degree} onChange={this.onChange} />
					</div>

					<div className="education-years">
						<div>
							<label>Start Year</label>
							<input type="number" name="startYear" value={startYear} onChange={this.onChange} />
						</div>

						<div>
							<label>End Year</label>
							<input type="number" name="endYear" value={endYear} onChange={this.onChange} />
						</div>
					</div>
				</div>

				<label>Description</label>
				<Editor className="description" value={description} onChange={this.editorChange} />
			</fieldset>
		);
	},


	getValue () {
		let {state} = this;
		let value = {};
		let input = Object.assign({}, this.props.item);

		for (let field of Object.keys(state)) {
			let v = state[field];
			delete input[field];

			if (v && !Editor.isEmpty(v)) {
				value[field] = Array.isArray(v) ? v : v.trim ? v.trim() : v;
			}
		}

		return Object.keys(value).length > 0
			? Object.assign({}, input, value)
			: null;
	}
});
